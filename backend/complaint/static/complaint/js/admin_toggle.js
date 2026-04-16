document.addEventListener('DOMContentLoaded', function() {
    // Inject CSS to hide the main Django Admin sidebar scrollbar
    // This keeps the sidebar scrollable but visually cleaner
    const sidebarStyle = document.createElement('style');
    sidebarStyle.textContent = `
        /* Hide scrollbar for Chrome, Safari and Opera */
        #nav-sidebar::-webkit-scrollbar, #nav-sidebar *::-webkit-scrollbar {
            display: none !important;
            width: 0px !important;
            height: 0px !important;
            background: transparent !important;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        #nav-sidebar, #nav-sidebar * {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
        }
    `;
    document.head.appendChild(sidebarStyle);

    function toggleVisibility(triggerId, targetFieldNames) {
        const trigger = document.getElementById(triggerId);
        if (!trigger) return;

        function update() {
            const isByHand = trigger.value === 'BY_HAND';
            targetFieldNames.forEach(fieldName => {
                // Django admin adds class 'field-<fieldname>' to the row
                const rows = document.querySelectorAll(`.field-${fieldName}`);
                rows.forEach(row => {
                    row.style.display = isByHand ? 'none' : '';
                });
            });
        }

        trigger.addEventListener('change', update);
        update(); // Run on initial load
    }

    // Toggle Application Acknowledgement based on Request Submission Mode
    toggleVisibility('id_request_submission_mode', ['application_ack_file', 'application_ack_file_preview']);

    // Toggle Internal Review Acknowledgement based on Review Submission Mode
    toggleVisibility('id_review_submission_mode', ['internal_review_ack_file', 'internal_review_ack_file_preview']);

    // Toggle Procedural Status Files (Handles both standalone Hearing form and Inline forms)
    const statusMap = {
        'FIRST_NOTICE': 'first_notice_file',
        'FINAL_NOTICE': 'final_notice_file',
        'SHOW_CAUSE': 'show_cause_file',
        'FINAL_SHOW_CAUSE': 'final_show_cause_file',
        'TEN_DAYS_ORDER': 'ten_days_order_file',
        'PENALTY_ORDER': 'penalty_order_file',
        'ADJOURNMENT': 'adjournment_file',
        'RECALL': 'recall_file',
        'FURTHER_PROCEEDINGS': 'further_proceedings_file',
        'DISPOSED_OFF': 'disposed_off_file',
        'NON_MAINTAINABLE': 'non_maintainable_file',
    };

    function updateStatusFiles(selectElement) {
        const selectedStatus = selectElement.value;
        
        // Determine scope/container to ensure we only toggle fields in the same row/block
        // 1. Stacked Inline: .inline-related
        // 2. Tabular Inline: tr.form-row
        // 3. Standalone: document (fallback)
        const container = selectElement.closest('.inline-related') || selectElement.closest('tr.form-row') || document;

        Object.entries(statusMap).forEach(([status, fieldName]) => {
            // Find the field wrapper within the container
            const fieldRow = container.querySelector(`.field-${fieldName}`);
            if (fieldRow) {
                fieldRow.style.display = (status === selectedStatus) ? '' : 'none';
            }
        });

        // Toggle Disposal Reason field
        const disposalReasonRow = container.querySelector('.field-disposal_reason');
        if (disposalReasonRow) {
            disposalReasonRow.style.display = (selectedStatus === 'DISPOSED_OFF') ? '' : 'none';
        }
    }

    // Use Event Delegation for change events to handle both static and dynamic elements
    document.body.addEventListener('change', function(e) {
        if (e.target && e.target.matches && e.target.matches('select[id$="procedural_status"]')) {
            updateStatusFiles(e.target);
        }
    });

    // Initial run for existing fields on page load
    document.querySelectorAll('select[id$="procedural_status"]').forEach(select => {
        updateStatusFiles(select); // Initial run
    });

    // Handle dynamically added inline rows to set initial state (hide fields)
    if (window.django && window.django.jQuery) {
        window.django.jQuery(document).on('formset:added', function(event, $row, formsetName) {
            const select = $row.find('select[id$="procedural_status"]')[0];
            if (select) {
                updateStatusFiles(select);
            }
        });
    }

    // Collapse Past Hearings in Inline
    function initHearingRowCollapsing() {
        const hearingGroup = document.getElementById('hearings-group');
        if (!hearingGroup) return;

        // Add Collapse/Expand All Button
        const title = hearingGroup.querySelector('h2');
        if (title && !document.getElementById('hearing-collapse-all-btn')) {
            const btnContainer = document.createElement('div');
            btnContainer.style.margin = '10px 0';
            
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'hearing-collapse-all-btn';
            toggleBtn.type = 'button';
            toggleBtn.textContent = 'Collapse All';
            toggleBtn.className = 'button';
            toggleBtn.style.background = '#475569';
            toggleBtn.style.color = 'white';
            toggleBtn.style.padding = '5px 15px';
            toggleBtn.style.border = 'none';
            toggleBtn.style.borderRadius = '4px';
            toggleBtn.style.cursor = 'pointer';

            toggleBtn.addEventListener('click', function() {
                const isCollapsing = toggleBtn.textContent === 'Collapse All';
                const rows = hearingGroup.querySelectorAll('.inline-related:not(.empty-form)');
                
                rows.forEach(row => {
                    const fieldset = row.querySelector('fieldset');
                    const header = row.querySelector('h3');
                    const indicator = header ? header.querySelector('.collapse-indicator') : null;
                    
                    if (fieldset && header) {
                        // Force state based on button action
                        const shouldHide = isCollapsing;
                        fieldset.style.display = shouldHide ? 'none' : 'block';
                        header.style.backgroundColor = shouldHide ? '#e2e8f0' : '#cbd5e1';
                        header.style.color = shouldHide ? '#475569' : '#1e293b';
                        if (indicator) indicator.innerHTML = shouldHide ? ' &#9654; (Details Collapsed)' : ' &#9660; (Details Expanded)';
                    }
                });
                toggleBtn.textContent = isCollapsing ? 'Expand All' : 'Collapse All';
            });

            title.after(btnContainer);
        }

        const rows = hearingGroup.querySelectorAll('.inline-related');
        // Use local date for comparison to match input values (YYYY-MM-DD)
        const now = new Date();
        const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

        rows.forEach(row => {
            if (row.classList.contains('empty-form')) return;

            // Find date input (standard django admin date widget)
            const dateInput = row.querySelector('input[name$="-hearing_date"]');
            // Also check for readonly field if it exists
            const dateReadonly = row.querySelector('.field-hearing_date .readonly');
            
            let dateVal = dateInput ? dateInput.value : (dateReadonly ? dateReadonly.textContent.trim() : null);
            
            // Determine if past (default to false if no date)
            let isPast = false;
            if (dateVal) {
                // Check if date is in the past
                // Django admin date format is typically YYYY-MM-DD in value attribute
                
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
                isPast = dateVal < today;
            } else {
                // Fallback for other formats (e.g. readonly text "Jan 1, 2024")
                const d = new Date(dateVal);
                if (!isNaN(d.getTime())) {
                    const dStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                    isPast = dStr < today;
                }
            }
            }

            // Enhance Delete Button Visibility and Tooltip
            const deleteSpan = row.querySelector('span.delete');
            if (deleteSpan) {
                const deleteLabel = deleteSpan.querySelector('label');
                const deleteInput = deleteSpan.querySelector('input[type="checkbox"]');
                
                if (deleteLabel) {
                    deleteLabel.textContent = ' Delete Hearing';
                    deleteLabel.style.color = '#dc2626';
                    deleteLabel.style.fontWeight = 'bold';
                    deleteLabel.title = "Check this box and click Save to permanently delete this hearing";
                }
                if (deleteInput) {
                    deleteInput.title = "Check this box and click Save to permanently delete this hearing";
                }
            }
            const removeLink = row.querySelector('a.inline-deletelink');
            if (removeLink) {
                removeLink.title = "Remove this hearing row";
                removeLink.style.color = '#dc2626';
            }

            const fieldset = row.querySelector('fieldset');
            const header = row.querySelector('h3');

            if (fieldset && header && !header.classList.contains('collapsible-processed')) {
                // Move Hearing Ordinal to Header
                const ordinalRow = row.querySelector('.field-hearing_ordinal');
                if (ordinalRow) {
                    const ordinalValue = ordinalRow.querySelector('.readonly');
                    if (ordinalValue) {
                        const ordinalText = ordinalValue.textContent.trim();
                        const ordinalSpan = document.createElement('span');
                        ordinalSpan.textContent = ordinalText + " - ";
                        ordinalSpan.style.fontWeight = 'bold';
                        ordinalSpan.style.marginRight = '10px';
                        header.insertBefore(ordinalSpan, header.firstChild);
                        ordinalRow.style.display = 'none';
                    }
                }

                // Setup Header Styles
                header.style.cursor = 'pointer';
                header.style.border = '1px solid #cbd5e1';
                header.style.padding = '10px 15px';
                header.style.borderRadius = '6px';
                header.style.transition = 'all 0.2s ease';
                header.classList.add('collapsible-processed');
                header.title = "Click to expand/collapse details";
                
                // Add visual indicator
                const indicator = document.createElement('span');
                indicator.className = 'collapse-indicator';
                indicator.style.opacity = '0.7';
                indicator.style.marginLeft = '10px';
                indicator.style.fontSize = '0.9em';
                header.appendChild(indicator);

                // Set Initial State
                if (isPast) {
                    fieldset.style.display = 'none';
                    header.style.backgroundColor = '#e2e8f0'; // Gray for past
                    header.style.color = '#475569';
                    indicator.innerHTML = ' &#9654; (Details Collapsed)';
                } else {
                    fieldset.style.display = 'block';
                    header.style.backgroundColor = '#cbd5e1'; // Darker gray/blue for active
                    header.style.color = '#1e293b';
                    indicator.innerHTML = ' &#9660; (Details Expanded)';
                }

                header.addEventListener('click', function(e) {
                    // Ignore clicks on inputs/checkboxes inside header
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;
                    
                    const isHidden = fieldset.style.display === 'none';
                    fieldset.style.display = isHidden ? 'block' : 'none';
                    indicator.innerHTML = isHidden ? ' &#9660; (Details Expanded)' : ' &#9654; (Details Collapsed)';

                    // Toggle styles based on state
                    if (isHidden) {
                        header.style.backgroundColor = '#cbd5e1';
                        header.style.color = '#1e293b';
                    } else {
                        header.style.backgroundColor = '#e2e8f0';
                        header.style.color = '#475569';
                    }
                });
            }
        });
    }

    initHearingRowCollapsing();

    // Cascading Autocomplete for Complaint Admin
    if (typeof django !== 'undefined' && django.jQuery) {
        const $ = django.jQuery;
        
        // Clear Public Body when Department changes
        $('#id_department_fk').on('change', function() {
            $('#id_public_body_fk').val(null).trigger('change');
        });

        // Hook into Select2 opening for Public Body to inject department_id filter
        $(document).on('select2:opening', '#id_public_body_fk', function() {
            const $element = $(this);
            const instance = $element.data('select2');
            
            // Check if we have the instance and haven't wrapped it yet
            if (instance && !instance._departmentFilterWrapped) {
                const options = instance.options.options;
                if (options.ajax) {
                    const originalData = options.ajax.data;
                    options.ajax.data = function (params) {
                        const data = originalData ? originalData.call(this, params) : params;
                        const departmentId = $('#id_department_fk').val();
                        if (departmentId) {
                            data.department_id = departmentId;
                        }
                        return data;
                    };
                    instance._departmentFilterWrapped = true;
                }
            }
        });
    }
});