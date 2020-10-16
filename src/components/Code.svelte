<script>
  export let code;
  let index = 1;

  function setIndex(i) {
    index = i;
  }
</script>

<style>
  .code {
    position: relative;
    float: right;
    width: 100%;
    background: rgb(50, 61, 66);
    color: rgb(151, 192, 211);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.3);
    margin-bottom: 40px;
  }

  .select {
    position: absolute;
    top: -30px;
    right: 15px;
  }

  .lang {
    margin-left: 10px;
    display: inline;
    cursor: pointer;
  }

  .selected {
      text-decoration: underline;
  }
</style>

<div class="code">
  <div class="select">
    {#each code.parts as codePart, i}
      <div class="lang {i === index ? 'selected' : ''}" on:click={() => setIndex(i)}>{codePart.lang}</div>
    {/each}
  </div>
  <pre>{code.parts[index].part}</pre>
</div>
