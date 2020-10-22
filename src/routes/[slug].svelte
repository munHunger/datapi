<script context="module">
  export function preload({ params }) {
    return this.fetch("/index.json")
      .then(r => r.json())
      .then(sidebar => {
        return { sidebar };
      })
      .then(sidebar =>
        this.fetch(`${params.slug}.json`)
          .then(r => r.json())
          .then(data => {
            console.log(data);
            data = data.reduce(
              (acc, val) => {
                switch (val.type) {
                  case "LITERAL":
                  case "ITALIC":
                  case "BOLD":
                  case "LINK":
                  case "HEADER":
                  default:
                    acc[acc.length - 1].left.push(val);
                    break;
                  case "CODEBLOCK":
                    acc.push({ left: [], right: [] });
                    acc[acc.length - 1].right.push(val);

                    break;
                }
                return acc;
              },
              [{ left: [], right: [] }]
            );
            return { data, topic: params.slug.split("-"), sidebar };
          })
      );
  }
</script>

<script>
  import Code from "../components/Code.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  export let data, topic, sidebar;
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
    box-sizing: border-box;
  }
  .middle-bg,
  .right-bg {
    padding: 2rem;
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

  .special {
    display: inline;
    background-color: rgb(216, 222, 224);
    color: rgb(84, 56, 85);
    border: 1px solid rgb(192, 200, 202);
    padding: 0px 3px 0px 3px;
    box-sizing: border-box;
  }
  .post {
    position: absolute;
    left: 10%;
    width: 90%;
    box-sizing: border-box;
    padding: 20px;
    margin-top: 60px;
  }
  .part {
    display: inline;
  }
  .part .left {
    width: 65%;
    color: rgb(78, 108, 110);
    float: left;
  }
  .part .right {
    width: 30%;
    margin-left: 70%;
  }

  .clear {
    clear: both;
  }

  .link {
    position: relative;
    display: inline;
  }

  .link .popup {
    background-color: rgba(78, 91, 97, 0.9);
    border-radius: 20px;
    color: rgb(160, 170, 175);
    padding: 20px;
    position: absolute;
    top: -10px;
    left: 50%;
    width: 200px;
    transform: translate(-50%, -100%);
    opacity: 0;
    transition: all 0.25s;
  }
  .link:hover .popup {
    opacity: 1;
  }
</style>

<svelte:head>
  <title>{topic[topic.length - 1]}</title>
</svelte:head>

<main>
  <div class="middle-bg" />
  <div class="left-bg">
    <Sidebar data={sidebar.sidebar} />
  </div>
  <div class="right-bg" />
  <div class="post">
    {#each data as segment, i}
      <div class="part">
        <div class="left">
          {#each segment.left as part}
            {#if part.type === 'LITERAL'}
              {part.part}
            {:else if part.type === 'BOLD'}
              <b>{part.part}</b>
            {:else if part.type === 'ITALIC'}
              <i>{part.part}</i>
            {:else if part.type === 'SPECIAL'}
              <div class="special">{part.part}</div>
            {:else if part.type === 'HEADER'}
              <h1>{part.part}</h1>
            {:else if part.type === 'LINK'}
              <div class="link">
                <a href={part.url}>{part.name}</a>
                {#if part.popup}
                  <div class="popup">
                    {#each part.popup as part}
                      {#if part.type === 'LITERAL'}
                        {part.part}
                      {:else if part.type === 'BOLD'}
                        <b>{part.part}</b>
                      {:else if part.type === 'ITALIC'}
                        <i>{part.part}</i>
                      {:else if part.type === 'SPECIAL'}
                        <div class="special">{part.part}</div>
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
            {:else if part.type === 'NEW_LINE'}
              <br />
              <br />
            {/if}
          {/each}
        </div>
        <div class="right">
          {#each segment.right as part}
            {#if part.type === 'CODEBLOCK'}
              <Code code={part} />
            {/if}
          {/each}
        </div>
        <div class="clear" />
      </div>
    {/each}
  </div>
</main>
