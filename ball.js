class Ball {
    constructor(gameBox) {
        this.gameBox = gameBox;
        this.width = 20;
        this.height = 20;
        
        // Track if ball is attached to the paddle
        this.isLaunched = false; 

        this.speedX = 5;
        this.speedY = -5; // Moves UP toward bricks

        // Create the HTML element
        this.element = document.createElement('div');
        this.element.className = 'ball';
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.backgroundColor = "red";
        this.element.style.borderRadius = "50%";
        this.element.style.position = "absolute";

        this.gameBox.appendChild(this.element);
    }

    update(paddleX, paddleWidth, paddleHeight) {
        if (!this.isLaunched) {
            // STICK LOGIC: Centers ball on the paddle
            this.x = paddleX + (paddleWidth / 2) - (this.width / 2);
            this.y = this.gameBox.clientHeight - paddleHeight - this.height;
        } else {
            // THROW LOGIC: Movement
            this.x += this.speedX;
            this.y += this.speedY;

            // Wall Collisions
            if (this.x <= 0 || this.x >= this.gameBox.clientWidth - this.width) {
                this.speedX *= -1;
            }
            // Ceiling Collision
            if (this.y <= 0) {
                this.speedY *= -1;
            }
        }

        // Move the visual element on screen
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}