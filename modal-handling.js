document.addEventListener("DOMContentLoaded", async function () {
    const memberstack = window.$memberstackDom;
    let memberData;
    let scrollPosition = 0;

    async function getMemberData() {
        try {
            const response = await memberstack.getMemberJSON();
            return response?.data || {};
        } catch (error) {
            console.error("Error fetching member data:", error);
            return {};
        }
    }

    function showNotification(message, type = 'add') {
        const container = document.getElementById('notification-container');
        if (container.currentNotification) {
            container.currentNotification.remove();
        }

        const notification = document.createElement('div');
        notification.classList.add('notification', 'show');
        if (type === 'remove') {
            notification.style.backgroundColor = '#ff3d2e';
        } else {
            notification.style.backgroundColor = '#4caf50';
        }

        notification.innerHTML = `<span>${message}</span>`;
        container.appendChild(notification);

        container.currentNotification = notification;

        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
                container.currentNotification = null;
            }, 600);
        }, 3000);
    }

    memberData = await getMemberData();
    // More modal handling code here
});
