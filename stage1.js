// stage1.js

// 1. Define the weights for sorting
const WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

// 2. Paste the Access Token you saved in the previous step here
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZW5ndXZhc2hhcm1pbGFwcmVldGhpLjIzLmNzZEBhbml0cy5lZHUuaW4iLCJleHAiOjE3ODIxOTM4MTksImlhdCI6MTc4MjE5MjkxOSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjAwZDE2YWQ4LTliY2EtNDdkMS05NTcxLWJmMWQ2ZDJiNzE3MCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Imtlbmd1dmEgc2hhcm1pbGEgcHJlZXRoaSIsInN1YiI6IjZmM2QzMWQ1LTAyNTEtNGRiOS1hNjlkLTU2YzhlNDA5NzY4OSJ9LCJlbWFpbCI6Imtlbmd1dmFzaGFybWlsYXByZWV0aGkuMjMuY3NkQGFuaXRzLmVkdS5pbiIsIm5hbWUiOiJrZW5ndXZhIHNoYXJtaWxhIHByZWV0aGkiLCJyb2xsTm8iOiJhMjMxMjY1NTExNTgiLCJhY2Nlc3NDb2RlIjoiTVRxeGFyIiwiY2xpZW50SUQiOiI2ZjNkMzFkNS0wMjUxLTRkYjktYTY5ZC01NmM4ZTQwOTc2ODkiLCJjbGllbnRTZWNyZXQiOiJ4UXBVbkF2WllUeGJqSFZWIn0.q-3BFgaWNJvPm7BadEF9Cb4vnOMbKHoeCPv-4wM4rzg"; 

async function getTopNotifications() {
    const url = "http://4.224.186.213/evaluation-service/notifications";

    try {
        // Fetch data from the protected API route
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        const notifications = data.notifications;

        // 3. Sort by Weight first, then by Timestamp (Newest first)
        const sortedNotifications = notifications.sort((a, b) => {
            const weightA = WEIGHTS[a.Type] || 0;
            const weightB = WEIGHTS[b.Type] || 0;

            if (weightB !== weightA) {
                return weightB - weightA; // Higher weight comes first
            } else {
                return new Date(b.Timestamp) - new Date(a.Timestamp); // Newest date comes first
            }
        });

        // 4. Take only the top 10 results
        const top10 = sortedNotifications.slice(0, 10);

        console.log("--- TOP 10 PRIORITY NOTIFICATIONS ---");
        console.log(JSON.stringify(top10, null, 2));

    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
}

// Run the function
getTopNotifications();