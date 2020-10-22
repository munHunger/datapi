<script context="module">
  export function preload() {
    return this.fetch(`/index.json`)
      .then(r => r.json())
      .then(data => {
        console.log(data);
        return { data };
      });
  }
</script>

<script>
  export let data;

  let selectPath = [];
  function clicked(topic) {
    selectPath = selectPath.concat(topic.name || topic);
    if (typeof topic === "string") {
      window.location = selectPath.join("-");
    }
  }
</script>

<style>
  .wrapper {
    margin-top: 60px;
  }
  .item {
    padding: 1rem;
    cursor: pointer;
    border-bottom: 1px solid rgb(198, 201, 202);
    color: rgb(50, 59, 59);
  }
  .child {
    padding: 0.2rem;
    cursor: pointer;
    border-left: 10px solid rgb(229, 239, 243);
    color: rgb(50, 59, 59);
  }
</style>

{#if data}
  <div class="wrapper">
    {#each data as topic}
      <div class="item" on:click={() => clicked(topic)}>
        {#if typeof topic === 'object'}{topic.name}{:else}{topic}{/if}
        {#if topic.name && (selectPath || [])[0] === topic.name}
          {#each topic.children as child}
            <div class="child" on:click={() => clicked(child)}>{child}</div>
          {/each}
        {/if}
      </div>
    {/each}
  </div>
{/if}
