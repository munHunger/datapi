<script>
  export let segment;
</script>

<style>
  nav {
    position: fixed;
    width: 100%;
    height: 60px;
    z-index: 99;
    top: 0px;
    background: rgb(127, 138, 145);
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  .part {
    position: relative;
    display: inline-block;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: 0.3rem;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 25px;
    color: rgb(195, 203, 207);
  }

  .part::before {
    content: "> ";
  }
</style>

<nav>
  {#if segment}
    {#each segment.split('-') as part}
      <div class="part">{part}</div>
    {/each}
  {:else}
    <div class="part">home</div>
  {/if}
</nav>
