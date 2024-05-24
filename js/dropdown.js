document.addEventListener('DOMContentLoaded', function() {
    function hideOtherDropdowns(currentDropdownContent) {
        dropdownContents.forEach(content => {
            if (content !== currentDropdownContent) {
                content.style.display = 'none';
            }
        });
    }

    const dropdownLinks = document.querySelectorAll('[id^="tagsDropdown"]');
    const dropdownContents = document.querySelectorAll('.dropdown-content');

    dropdownContents.forEach(content => {
        content.style.display = 'none';
    });
    dropdownLinks.forEach((link, index) => {
        const dropdownContent = dropdownContents[index];

        link.addEventListener('mouseenter', function() {
            hideOtherDropdowns(dropdownContent);
            dropdownContent.style.display = 'block';
        });

        dropdownContent.addEventListener('mouseleave', function() {
            dropdownContent.style.display = 'none';
        });
    });
});
