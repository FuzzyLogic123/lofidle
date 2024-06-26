<script>
  import { sum } from "./lib/utils";
  import Footer from "./lib/Footer/Footer.svelte";
  import Guesses from "./lib/Guesses.svelte";
  import Search from "./lib/Footer/Search.svelte";
  import Timeline from "./lib/Footer/Timeline.svelte";
  import TutorialModal from "./lib/Modals/TutorialModal.svelte";
  import { getLofidle } from "./lib/utils";
  import AnswerScreenContent from "./lib/AnswerScreen.svelte";
  import { analytics } from "./firebaseConfig";
  import { logEvent } from "firebase/analytics";
  import StatsModal from "./lib/Modals/StatsModal.svelte";
  import InfoModal from "./lib/Modals/InfoModal.svelte";
  import { onMount } from "svelte";

  onMount(setTheme);
  onMount(updateFromLocalStorage);
  const lofidle = getLofidle();

  let showFinalPage = false;
  let increments = [2, 2, 6, 10, 10];
  let guesses = [];
  let audio = new Audio(lofidle.lofi_preview_url);

  let currentTimeLimit = 0;

  let nowPlaying = false;
  let showStats = false;
  let showInfo = false;
  let showTutorial;
  let previousScores;
  let lastCompletedDate;

  let hasShownStats = false;

  audio.addEventListener("timeupdate", stopAudioAtTimeLimit);

  $: if (guesses.length !== 0) {
    localStorage.setItem("guesses", JSON.stringify(guesses));
    currentTimeLimit += increments[guesses.length] * 1000;
  }

  function stopAudioAtTimeLimit() {
    if (audio.currentTime * 1000 >= currentTimeLimit - 100 || audio.paused) {
      audio.pause();
      nowPlaying = false;
    }
  }

  function isSuccess(guess) {
    return (
      guess ===
      `${lofidle.song_name} - ${lofidle.original_artist}`.toLocaleLowerCase()
    );
  }

  $: if (
    guesses.length === increments.length ||
    (guesses.length > 0 && guesses.at(-1).status === "correct")
  ) {
    if (!JSON.parse(localStorage.getItem("isCompleted"))) {
      // don't repeat logs
      if (guesses.at(-1).status == "correct") {
        logEvent(analytics, `${guesses.length}`);
        logEvent(analytics, "success");
        previousScores.push(guesses.length);
      } else {
        previousScores.push(-1);
        logEvent(analytics, "fail");
      }
    }

    localStorage.setItem("isCompleted", JSON.stringify(true));
    localStorage.setItem("lastCompletedDate", JSON.stringify(new Date()));
    visitLastPage();
    localStorage.setItem("previousScores", JSON.stringify(previousScores));
  }

  function playMusic() {
    if (audio.paused) {
      audio.currentTime = 0;
      currentTimeLimit = getTimeUsed(guesses.length + 1) * 1000;
      audio.play();
      nowPlaying = true;
    } else {
      audio.pause();
      nowPlaying = false;
    }
  }

  function skipSegment() {
    if (guesses.length < increments.length) {
      guesses.push({
        guess: "SKIPPED",
        status: "skipped",
      });
      guesses = guesses;
    }
  }

  function playAnswer() {
    audio.pause();
    audio.removeEventListener("timeupdate", stopAudioAtTimeLimit);
    audio.currentTime = 0;
    audio.src = lofidle.original_preview_url;
    audio.volume = 0.3;
    audio.play();
  }

  function handleStatsClick() {
    if (!hasShownStats) {
      logEvent(analytics, "stats-page");
    }
    hasShownStats = true;
    showStats = true;
  }

  function visitLastPage() {
    showFinalPage = true;
    playAnswer();
    // mute audio if you leave the window
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        audio.pause();
      } else {
        audio.play();
      }
    });
  }

  function getStatus(guess) {
    if (isSuccess(guess)) {
      return "correct";
    } else if (isCorrectArtist(guess)) {
      return "correctArtist";
    } else {
      return "incorrect";
    }
  }

  function isCorrectArtist(guess) {
    const correctArtist = lofidle.original_artist.toLocaleLowerCase();
    let artists = guess.split(" - ").at(-1).toLocaleLowerCase();
    artists = artists.split(",");
    for (let index = 0; index < artists.length; index++) {
      const artist = artists[index].trim();

      const correctArtists = correctArtist.split(",");
      for (let i = 0; i < correctArtists.length; i++) {
        const correctArtist = correctArtists[i].trim();
        if (correctArtist == artist) {
          return true;
        }
      }
    }
    return false;
  }

  function appendGuess(event) {
    const guess = event.detail;
    const status = getStatus(guess);
    guesses.push({
      guess: guess,
      status: status,
    });
    guesses = guesses;
    logEvent(analytics, "guess");
  }

  /**
   * @param {Date} lastCompletedDate
   */
  function isStreakValid(lastCompletedDate) {
    lastCompletedDate.setHours(23, 59, 59); // set time just before midnight (to the next Lofidle)
    lastCompletedDate.setDate(lastCompletedDate.getDate() + 1); // set the date to one day beyond that
    return new Date() < lastCompletedDate;
  }

  function verifyStreak() {
    if (!isStreakValid(lastCompletedDate)) {
      previousScores.push(0); // stops streak
    }
  }

  function updateFromLocalStorage() {
    const lastCheckIn = new Date(
      JSON.parse(localStorage.getItem("lastCheckIn"))
    );
    lastCompletedDate = new Date(
      JSON.parse(localStorage.getItem("lastCompletedDate"))
    );
    if (lastCheckIn.toDateString() !== new Date().toDateString()) {
      localStorage.setItem("guesses", JSON.stringify([]));
      localStorage.setItem("isCompleted", JSON.stringify(false));
    } else {
      guesses = JSON.parse(localStorage.getItem("guesses"));
    }

    previousScores = JSON.parse(localStorage.getItem("previousScores")) ?? [];
    showTutorial = !localStorage.getItem("firstVisit");
    logEvent(analytics, showTutorial ? "first_visit" : "return_visit");
    localStorage.setItem("lastCheckIn", JSON.stringify(new Date()))
    localStorage.setItem("firstVisit", JSON.stringify(false));
    verifyStreak();
  }

  function getTimeUsed(guessesLen) {
    return sum(increments.slice(0, guessesLen));
  }

  function setTheme() {
    let theme;
    const themeIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 4;
    switch (themeIndex) {
      case 0:
        theme = "orange";
        break;
      case 1:
        theme = "blue";
        break;
      case 2:
        theme = "purple";
        break;
      case 3:
        theme = "green";
        break;
    }
    document.documentElement.classList.add(theme);
  }
</script>

{#if showTutorial}
  <TutorialModal on:click={() => (showTutorial = false)} />
{:else if showStats}
  <StatsModal
    on:click={() => (showStats = false)}
    maxIncrement={increments.length}
    {previousScores}
  />
{:else if showInfo}
  <InfoModal on:click={() => (showInfo = false)} />
{/if}

<main class="content">
  {#if !showFinalPage}
    <h1 class="title">Lofidle</h1>
    <Guesses {guesses} {increments} />
    <Timeline {increments} {guesses} {nowPlaying} />
    <Search on:guess={appendGuess} />
  {:else}
    <AnswerScreenContent
      timeUsed={getTimeUsed(guesses.length)}
      {lofidle}
      {guesses}
      MAX_GUESSES={increments.length}
    />
  {/if}
  <Footer
    on:playSong={playMusic}
    on:skipSegment={skipSegment}
    on:stats={handleStatsClick}
    on:tutorial={() => (showTutorial = true)}
    on:info={() => (showInfo = true)}
    {nowPlaying}
    {showFinalPage}
  />
</main>

<div class="lines" />
<div class="background-image" />

<style>
  .lines {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-size: 1%;
    z-index: -1;
    opacity: 0.05;
    background-repeat: repeat;
    background-image: url("./assets/img/lines.jpg");
  }
  .background-image {
    z-index: -2;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
      var(--background-image);
    background-blend-mode: multiply;
    background-size: cover;
    background-position: 50% 80%;
    height: 100%;
    width: 100%;
    filter: blur(1px);
    -webkit-filter: blur(1px);
    box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.703);
  }

  .title {
    font-family: "nokia";
    position: relative;
    color: whitesmoke;
    font-size: 3em;
    margin: 0;
    margin-top: 0.4em;
    flex-grow: 0.05;
  }

  .content {
    /* margin-top: 1em; */
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    max-width: 640px;
    width: 100%;
    align-items: center;
  }
</style>
