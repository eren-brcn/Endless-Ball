class Obstacle {
    constructor(gameBox, x, y) {
        this.gameBox = gameBox;
        this.width = 80;
        this.height = 20;
        this.x = x;
        this.y = y;

        // Create the visual element
        this.element = document.createElement('div');
        this.element.className = 'obstacle';
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.backgroundColor = "orange";
        this.element.style.position = "absolute";
        this.element.style.border = "1px solid white";

        this.gameBox.appendChild(this.element);
    }

    destroy() {
        this.element.remove(); // Removes the brick from the screen
    }
}