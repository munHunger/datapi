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
  import Sidebar from "../components/Sidebar.svelte";
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
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<main>
  <div class="middle-bg" />
  <div class="left-bg">
    <Sidebar {data} />
  </div>
  <div class="right-bg" />
</main>
