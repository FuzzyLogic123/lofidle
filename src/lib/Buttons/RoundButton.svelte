<script>
</script>

<button on:click class="play-button">
  <slot />
</button>

<style>
  .play-button {
    aspect-ratio: 1/1;
    border-radius: 1000em;
    height: 4em;
    width: 4em;
    background-color: white;
    filter: drop-shadow(-0.25em 0.45em 0 var(--drop-shadow-color));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-bottom: 0.7em;
    outline: none;
    border: none;
    will-change: opacity;
  }

  .play-button:active {
    outline: none;
    transform: translate(-0.25em, 0.45em);
    filter: none;
  }
</style>
