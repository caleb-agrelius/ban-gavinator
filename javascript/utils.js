export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomEnemy() {
      const names = ['Ryan', 'Caleb', 'Andrew', 'Gavin', 'Michael', 'Sage', 'Elijah', 'Louie', 'Benjamin'];
      const types = ['Tank', 'Support', 'Normal', 'Damage'];
      const name = names[Math.floor(Math.random() * names.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      return new Enemy(name, type);
}
