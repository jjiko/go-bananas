module.exports = {
    game: `<div class="go-bananas">
            <div class="game-title linear-wipe-reverse">
                <h1 class="linear-wipe rotater">Go bananas</h1>
                <p class="game-description blinker">You have 60 seconds to collect all the bananas</p>
            </div>
            <div class="game-over">
                <div class="game-over-alignment"><h1>Game over!</h1></div>
            </div>
            <div class="game-over-score-container">
                <div class="game-over-message"></div>
                <div class="game-over-score">
                    <div class="score-points">
                        <div class="score-points-text"></div>
                    </div>
                    <div class="score-stars"></div>
                    <div class="score-totals"></div>
                </div>
                <div class="game-over-actions">
                    <button class="game-close">Close</button>
                    <button class="game-reset">Play again?</button>
                </div>
            </div>
            <div class="game-container">
                <div class="game bg-game">
                    <div class="counter" id="counter">00s</div>
                    <div class="score">
                        00
                    </div>
                </div>
            </div>
        </div>`,
    box: '<div class="box" style="width:${size}px; height:${size}px; left: ${length}px; transition: transform ${velocity}ms linear;">',
    eggplant: `<div class="eggplant bg-eggplant"></div>`,
    banana: `<div class="standard-banana bg-standard-banana"></div>`,
    altBanana: `<div class="standard-banana-2 bg-standard-banana-2"></div>`,
    magicBanana: `<div class="rare-banana bg-rare-banana swinging"></div>`,
    superBanana: `<div class="super-banana bg-super-banana swinging"></div>`,
    falling_cat: `<div class="falling-cat bg-falling-cat"></div>`,
    bomb: `<div class="bomb">
              <div class="bomb__center">
                <div class="bomb-image">
                  <div class="bomb-image__body"></div>
                </div>
              </div>
            </div>`,
    star: `<div class="star-wrap"><div class="star-five"></div></div>`,
    starFail: `<div class="star-wrap"><div class="star-five-fail"></div></div>`,
    score: `<div class="score-text">##B_COLLECTED##/##B_TOTAL## bananas collected</div>`,
    shield: `<div class="shield">
    <div class="shield--left"></div>
    <div class="shield--right"></div>
    <div class="shield--right-lighter"></div>
    <div class="shield--five"></div>
  </div>`
};