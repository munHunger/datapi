<script context="module">
  export function preload() {
    return this.fetch(`/index.json`)
      .then(r => r.json())
      .then(data => {
        data = data.reduce((acc, val) => {
          switch (val.type) {
            case "LITERAL":
            case "BOLD":
            case "LINK":
            case "HEADER":
              if (!(acc[acc.length - 1] || {}).left)
                acc.push({ left: true, val: [] });
              acc[acc.length - 1].val.push(val);
              break;
            case "CODEBLOCK":
              if ((acc[acc.length - 1] || {}).left)
                acc.push({ left: false, val: [] });
              acc[acc.length - 1].val.push(val);
              break;
            default:
              break;
          }
          return acc;
        }, []);
        console.log(JSON.stringify(data, null, 2));
        return { data };
      });
  }
</script>

<script>
  export let data;
</script>

<style>
  main {
    position: absolute;
    background-color: white;
    height: 100%;
    width: 100%;
    padding: 0em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .left-bg,
  .middle-bg,
  .right-bg {
    position: fixed;
    height: 100%;
    padding: 2rem;
    box-sizing: border-box;
  }

  .left-bg {
    background: rgb(221, 227, 230);
    width: 10%;
  }

  .middle-bg {
    background: rgb(245, 245, 245);
    left: 10%;
    width: 60%;
  }

  .right-bg {
    background: rgb(78, 91, 97);
    left: 70%;
    width: 30%;
  }

  .code {
    background: rgb(50, 61, 66);
    color: rgb(151, 192, 211);
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.3);
  }
  .special {
    display: inline;
    background-color: rebeccapurple;
  }
  .post {
    position: absolute;
    left: 10%;
    width: 90%;
    box-sizing: border-box;
    padding: 20px;
  }
  .part {
    display: inline;
  }
  .part .left {
    width: 65%;
    color: rgb(78, 108, 110);
  }
  .part .right {
    width: 30%;
    margin-left: 70%;
  }
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<main>
  <div class="middle-bg" />
  <div class="left-bg" />
  <div class="right-bg" />
  <div class="post">
    {#each data as segment}
      <div class="part">
        <div class={segment.left ? 'left' : 'right'}>
          {#each segment.val as part}
            {#if part.type === 'LITERAL'}
              {part.part}
            {:else if part.type === 'BOLD'}
              <b>{part.part}</b>
            {:else if part.type === 'SPECIAL'}
              <div class="special">{part.part}</div>
            {:else if part.type === 'HEADER'}
              <h1>{part.part}</h1>
            {:else if part.type === 'LINK'}
              <a href={part.url}>{part.name}</a>
            {:else if part.type === 'NEX_LINE'}
              <br />
            {:else if part.type === 'CODEBLOCK'}
              <div class="code">
                <pre>{part.part}</pre>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</main>
