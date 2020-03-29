function SeedRandom(state1,state2){
    var mod1=4294967087
    var mul1=65539
    var mod2=4294965887
    var mul2=65537
    if(typeof state1!="number"){
        state1=+new Date()
    }
    if(typeof state2!="number"){
        state2=state1
    }
    state1=state1%(mod1-1)+1
    state2=state2%(mod2-1)+1
    function random(limit){
        state1=(state1*mul1)%mod1
        state2=(state2*mul2)%mod2
        if(state1<limit && state2<limit && state1<mod1%limit && state2<mod2%limit){
            return random(limit)
        }
        return (state1+state2)%limit
    }
    return random
}

function getUrlVals() {
    var s = window.location.search.slice(1);
    s = s.split('&');

    var vals = {};
    for (var i = 0, len = s.length; i < len; i++) {
        var kv = s[i].split('=');
        if (kv[1] != undefined) {
            vals[kv[0]] = parseInt(kv[1]);
        }
    }
    return vals;
}

function setup() {
    var urlVals = getUrlVals();
    console.log(urlVals);

    if (urlVals.s == undefined) {
        urlVals.s = Math.floor(100000000 + Math.random() * 900000000);
        var q = '?';
        $.each(urlVals, function(k, v) { q += k + '=' + v});
        window.location.search = q;
    }

    $('#randomize').attr(
        'href', '?s=' + Math.floor(100000000 + Math.random() * 900000000));

    var corpus = dictionary.slice();

    var rand = SeedRandom(urlVals.s, urlVals.s);

    var tbl = $('#board');

    tbl.find('td').each(function() {
        var td = $(this).css('width', '20%').html('');

        var card = $('<div class="alert word-card" />');

        var upper = $('<div class="upper" />');
        var circ = $('<div />').append($('<span class="rounded-circle" />').append());
        upper.append(circ)
        upper.append($('<div class="word-field inverse" />'));
        upper.appendTo(card);

        var main = $('<div class="alert word-field main-word" />');
        main.appendTo(card);

        card.appendTo(td);
    });

    var cards = tbl.find('.word-card');

    var words = [];

    cards.each(function() {
        var txt = corpus.splice(rand(corpus.length), 1);
        words.push(txt);

        $(this).attr('id', 'word-' + txt).find('.word-field').text(txt);
    });

    var deck = {};

    var i = rand(words.length);
    var w = words.splice(i, 1);
    deck[w] = 'assassin';

    for (var j = 0; j < 16; j++) {
        i = rand(words.length);
        w = words.splice(i, 1);
        
        if (j % 2 == 0) {
            deck[w] = 'red';
        }
        else {
            deck[w] = 'blue';
        }
    }

    i = rand(words.length);
    w = words.splice(i, 1);
    if (rand(10) < 5) {
        deck[w] = 'red';
    }
    else {
        deck[w] = 'blue';
    }

    while (words.length > 0) {
        w = words.pop();
        deck[w] = 'civilian';
    }

    $.each(deck, function(word, type) {
        var card = $('#word-' + word);
        card.addClass(type);
        if (rand(10) < 5) {
            card.addClass('female');
        }
        else {
            card.addClass('male');
        }
    });


    cards.dblclick(function() {
        var card = $(this);
        card.toggleClass('flipped');
    });

    if (urlVals.c === 1) {
        $('body').addClass('codemaster');
    }
    else {
        $('body').removeClass('codemaster');
    }
}

$(function() {
    setup();
});