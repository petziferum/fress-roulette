<template>
  <div class="rainbowbutton"></div>
</template>
<script setup lang="ts"></script>
<style scoped>
.rainbowbutton {
  height: 50px;
  width: 100px;
  position: relative;
  margin-left: 50px;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 10%;
  border-radius: 5px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  &:before {
    content: "";
    height: 230%;
    width: 200%;
    position: absolute;
    background: conic-gradient(
      #fd004c,
      #fe9000,
      #fff020,
      #3edf4b,
      #3363ff,
      #b102b7,
      #fd004c
    );
    left: -50%;
    top: -60%;
    animation: spin 3s infinite linear;
  }
  &:after {
    content: "Neu";
    position: absolute;
    cursor: pointer;
    background-image: linear-gradient(45deg, #dcfffa, #6763ef);
    height: 85%;
    width: 92%;
    top: 7%;
    left: 4%;
    border-radius: 5px;
    color: #ffffff;
    font-size: 30px;
    font-weight: bold;
    letter-spacing: 6px;
    display: grid;
    place-items: center;
  }
}
@keyframes spin {
  100% {
    transform: rotate(-360deg);
  }
}
</style>
