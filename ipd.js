/*
jQuery plugin for making iterated Prisoner’s Dilemma games
that employ a memory-one strategy. Provides the function

  ipd(strategy, payoffs)

which should be called on an element like this

  <div class="game">
    <form>
      Your move:
      <input type="submit" class="cooperate" name="x" value="Cooperate">
      <input type="submit" class="defect" name="x" value="Defect">
    </form>
    <div>Your average score: <span class="your-average-score"></span></div>
    <div>My average score: <span class="my-average-score"></span></div>
    <h3>History <a class="reset-game" href="#">new game</a></h3>
    <div class="history">
    </div>
  </div>

Most of these classes are optional, though obviously it can’t be played without the form & buttons.

The strategy is given as four probabilities, interpreted as my (the computer player’s)
probability of cooperation in each of the four scenarios.

Payoffs are standard [ [3,3], [0,5], [5,0], [1,1] ] unless explicitly supplied.
*/

jQuery.fn.ipd = function(strategy, payoffs) {
    var $this = this;

    if (typeof strategy == "undefined") {
        strategy = [2/3, 2/3, 0, 1/3];
    }
    if (jQuery.isArray(strategy)) {
        strategy = {
            "true,true": strategy[0],
            "true,false": strategy[1],
            "false,true": strategy[2],
            "false,false": strategy[3]
        };
    }

    if (typeof payoffs == "undefined") {
        payoffs = [ [3,3], [0,5], [5,0], [1,1] ];
    }
    if (jQuery.isArray(payoffs)) {
        payoffs = {
            "true,true":   { "you": payoffs[0][0], "me": payoffs[0][1] },
            "true,false":  { "you": payoffs[1][0], "me": payoffs[1][1] },
            "false,true":  { "you": payoffs[2][0], "me": payoffs[2][1] },
            "false,false": { "you": payoffs[3][0], "me": payoffs[3][1] }
        };
    }

    function calculateMyMove(your_last_move, my_last_move) {
        var my_probability_of_cooperation = strategy[your_last_move + "," + my_last_move];

        return Math.random() < my_probability_of_cooperation;
    }

    function calculateScores(your_move, my_move) {
        return payoffs[your_move + "," + my_move];
    }

    // Pad a number n with zeros to k digits
    function zeroPad(k, n) {
        var s = "" + n;
        while (s.length < k) s = '0' + s;
        return s;
    }
    // Format a number to three decimal places
    function formatNumber(n) {
        var integer_part = Math.floor(n);
        var fractional_part = n - integer_part;

        return integer_part + "." + zeroPad(3, Math.round(1000 * fractional_part));
    }

    var your_move
        , your_last_move = true
        , my_last_move = true
        , your_total_score = 0
        , my_total_score = 0
        , number_of_moves = 0;

    $this.find("form .cooperate").click(function() {
        your_move = true;
        return true;
    });
    $this.find("form .defect").click(function() {
        your_move = false;
        return true;
    });

    var move_template = $("<div><span class='move-number'></span>. You <span class='your-move'></span> (<span class='your-score'></span> points) and I <span class='my-move'></span> (<span class='my-score'></span> points)</div>");
    $this.find("form").submit(function(e) {
        e.preventDefault();
        var my_move = calculateMyMove(your_last_move, my_last_move);
        var scores = calculateScores(your_move, my_move);
    
        // Update the totals
        my_total_score += scores.me;
        your_total_score += scores.you;
        number_of_moves += 1;
    
        // Update the page
        $this.find(".your-average-score").text(formatNumber(your_total_score/number_of_moves));
        $this.find(".my-average-score").text(formatNumber(my_total_score/number_of_moves));
        var this_move = move_template.clone();
        this_move.find(".move-number").text(number_of_moves).end()
                         .find(".your-move").text(your_move ? "cooperated" : "defected").end()
                         .find(".your-score").text(scores.you).end()
                         .find(".my-move").text(my_move ? "cooperated" : "defected").end()
                         .find(".my-score").text(scores.me).end();
        $this.find(".history").prepend(this_move);
    
        // The current moves are next time’s last moves
        your_last_move = your_move;
        my_last_move = my_move;
        return false;
    });

    $this.find(".reset-game").click(function() {
        your_total_score = 0;
        my_total_score = 0;
        number_of_moves = 0;

        $this.find(".your-average-score, .my-average-score, .history").html("");

        return false;
    });
};
