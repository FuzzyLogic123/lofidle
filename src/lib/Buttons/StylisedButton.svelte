<script>
</script>

<button class="submit-button" on:click>
  <slot />
</button>

<style>
  .submit-button {
    /* aspect-ratio: 1/1; */
    /* height: 2.5em; */
    /* width: 3em; */
    border: 1px black solid;
    padding: 0.5em;
    font-family: "nokia";
    filter: drop-shadow(-0.25em 0.45em 0 var(--drop-shadow-color));
    background-color: whitesmoke;
    color: var(--button-primary-color);
    margin-top: -1em;
    outline: none;
    /* border: none; */
  }

  .submit-button:active {
    translate: -0.25em 0.45em;
    filter: none;
  }
</style>
