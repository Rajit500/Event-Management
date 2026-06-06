function startCountdown(deadlineDate) {
    const countdownEl = document.getElementById('countdown');

    function update() {
        const now = new Date().getTime();
        const deadline = new Date(deadlineDate).getTime();
        const diff = deadline - now;

        // If deadline passed
        if (diff <= 0) {
            countdownEl.innerHTML = `
                <p style="color:red; font-weight:600;">
                    Registration Closed ❌
                </p>`;
            return;
        }

        // Calculate time units
        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Show timer
        countdownEl.innerHTML = `
            <div class="time-box">
                <span class="number">${days}</span>
                <span class="label">Days</span>
            </div>
            <div class="time-box">
                <span class="number">${hours}</span>
                <span class="label">Hours</span>
            </div>
            <div class="time-box">
                <span class="number">${minutes}</span>
                <span class="label">Mins</span>
            </div>
            <div class="time-box">
                <span class="number">${seconds}</span>
                <span class="label">Secs</span>
            </div>`;
    }

    // Run every second
    update();
    setInterval(update, 1000);
}