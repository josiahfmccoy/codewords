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
        var k = kv[0];
        var v = kv[1];
        if (v != undefined) {
            vals[k] = k == 's' ? parseInt(v) : v;
        }
    }
    return vals;
}

function createCard() {
    var card = $('<div class="alert word-card" />');

    var upper = $('<div class="upper" />');

    upper.append($('<div class="codemaster-symbol alert text-center" />')
        .append('<i class="far fa-circle" />')
        .append('<i class="far fa-square" />')
        .append('<span>&times;</span>'));

    var circ = $('<div />').append($('<span class="rounded-circle" />').append());
    upper.append(circ);

    upper.append($('<div class="word-field inverse" />'));

    upper.appendTo(card);

    var main = $('<div class="alert word-field main-word" />');
    main.appendTo(card);

    return card;
}

function setup(dictionary) {
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
        var card = createCard();
        card.appendTo(td);
    });

    var cards = tbl.find('.word-card');

    var words = [];

    cards.each(function(i) {
        var txt = corpus.splice(rand(corpus.length), 1)[0];

        var k = 'w' + (i + 1);
        if (urlVals[k] != undefined) {
            txt = urlVals[k];
        }
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
        tbl.removeClass('blue-double-agent');
        tbl.addClass('red-double-agent');
    }
    else {
        deck[w] = 'blue';
        tbl.removeClass('red-double-agent');
        tbl.addClass('blue-double-agent');
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
}

$(function() {
    var dictionary = [];
    $.ajax({url: dictURL}).done(function(content) {
        dictionary = content.split('\n').filter(x => x.trim() != '');
        setup(dictionary);
    });

    $('#board .word-card').dblclick(function() {
        var card = $(this);
        card.toggleClass('flipped');
    });
    $('#board .word-card').on('touch', function() {
        var card = $(this);
        card.toggleClass('flipped');
    });

    $('#copy-url').click(function(e) {
        e.preventDefault();

        var el = document.createElement('textarea');
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.value = window.location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        var me = $(this);
        me.popover('show');

        setTimeout(function() {
            me.popover('hide')
        }, 500);
    });

    var codemaster = false;

    $('#codemaster-toggle').click(function(e) {
        e.preventDefault();

        if (!codemaster) {
            codemaster = confirm('Are you sure you want to show the codemaster view?\n' +
                'Once you do, there\'s no turning back!');
            if (!codemaster) {
                return;
            }
        }

        $('body').toggleClass('codemaster');
    });
});