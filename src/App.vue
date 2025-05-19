<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

button {
  cursor: pointer;
  padding: 8px 16px;
  background-color: #4e72b8;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  margin: 5px;
}

button:hover {
  background-color: #3a5a9b;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style> 