
traits = [
    [ 'Chaste', 'Lustful' ],
    [ 'Energetic', 'Lazy' ],
    [ 'Forgiving', 'Vengeful' ],
    [ 'Generous', 'Selfish' ],
    [ 'Honest', 'Deceitful' ],
    [ 'Just', 'Arbitrary' ],
    [ 'Merciful', 'Cruel' ],
    [ 'Modest', 'Proud' ],
    [ 'Prudent', 'Reckless' ],
    [ 'Spiritual', 'Worldly' ],
    [ 'Temperate', 'Indulgent' ],
    [ 'Trusting', 'Suspicious' ],
    [ 'Valorous', 'Cowardly' ],
    ]


skills = []
passions = []

function refreshdata(id) {
    $.ajax({
      url: "../json?id="+id,
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      success: function( data ) {
      $('.skill .ui-icon').hide()
      $('#traits .ui-icon-check').hide()
      $('#passions .ui-icon').hide()
      char = data.char
      $( "#cid" ).val(id)
      $( "#json" ).val(JSON.stringify(char, null, 2))

      $('#name').text(char['name'])
      if  ('url' in char) {
        $('#charimg').html('<img src="'+char['url']+'"/>')
      } else {
        $('#charimg').html('')
      }

      $('#left').html('')
      if ('stats' in char) {
          $('#left').html('<div class="stats" id="stats"><div>Stats</div>'
          +'<div>'
          +'<div><div>Size</div><div>'+char['stats']['siz']+'</div></div>'
          +'<div><div>Dexterity</div><div>'+char['stats']['dex']+'</div></div>'
          +'<div><div>Strength</div><div>'+char['stats']['str']+'</div></div>'
          +'<div><div>Constitution</div><div>'+char['stats']['con']+'</div></div>'
          +'<div><div>Appearence</div><div>'+char['stats']['app']+'</div></div>'
          +'</div>'
          +'<div>'
          +'<div><div>Damage</div><div>'+Math.round((char['stats']['str']*1+char['stats']['siz']*1)/6)+'d6</div></div>'
          +'<div><div>Healing Rate</div><div>'+Math.round((char['stats']['con']*1+char['stats']['siz']*1)/10)+'</div></div>'
          +'<div><div>Move Rate</div><div>'+Math.round((char['stats']['dex']*1+char['stats']['siz']*1)/10)+'</div></div>'
          +'<div><div>HP</div><div>'+Math.round((char['stats']['con']*1+char['stats']['siz']*1)/6)+'</div></div>'
          +'<div><div>Unconscious</div><div>'+Math.round((char['stats']['con']*1+char['stats']['siz']*1))+'</div></div>'
          +'</div>'
          +'</div>');
      }
      if ('skills' in char) {
          skillcount = 0;
          skills = []
          for (const [sgn, sgv] of Object.entries(char['skills'])) {
              $('#left').append('<div class="skillgroup"><div>'+sgn+'</div></div>');
              for (const [sn, sv] of Object.entries(sgv)) {
                  $('#left > div').last().append('<div class="skill" id="skill_'+skillcount+'"><div>'+sn+'</div><div><div>'+sv+'</div><div><span class="ui-icon ui-icon-check"></span></div></div></div>');
                  skills[skillcount++]='skills.'+sgn+'.'+sn;
              }
          }
      }
      $('#passions').html('')
      if ('passions' in char) {
          $('#passions').append('<div>Passions</div><div></div>');
          count = 0;
          passions = []
          for (const [pn, pv] of Object.entries(char['passions'])) {
              $('#passions').last().append('<div class="passion" id="passion_'+count+'"><div>'+pn+'</div><div><div>'+pv+'</div><div><span class="ui-icon ui-icon-check"></span></div></div></div>');
              passions[count++]='passions.'+pn;
          }
      }
      if ('traits' in char) {
       $('#traits').show();
         for (const [tn, tv] of Object.entries(char['traits'])) {
            $('#trait_'+tn+' div:nth-child(2)').text(tv)
            $('#trait_'+tn+' div:nth-child(6)').text(20-tv*1)
         }
      } else {
       $('#traits').hide();
      }
      $('#description').html('')
      if ('description' in char) {
        $('#description').html(char['description'].replace("\n", "<br/>"))
      }
      $('#longdescription').html('')
      if ('longdescription' in char) {
        $('#longdescription').html(char['longdescription'].replace("\n", "<br/>"))
      }
     $('div.skill .ui-icon').hide()
     $('#traits .ui-icon-check').hide()
     $('#passions .ui-icon').hide()
     if ('marks' in data) {
         for (i in skills) {
            if (data['marks'].includes(skills[i].replace(/.*\./g, ""))) {
                console.log(skills[i])
                $('#skill_'+i+' .ui-icon').show()
            }
         }
         for (i in passions) {
            if (data['marks'].includes(passions[i].replace(/.*\./g, ""))) {
                console.log(passions[i])
                $('#passion_'+i+' .ui-icon').show()
            }
         }
         for (i in traits) {
            if (data['marks'].includes(traits[i][0])) {
              $('#trait_'+traits[i][0].toLowerCase().substring(0,3)+' div.div-table-col:nth-child(1) .ui-icon').show()
            }
            if (data['marks'].includes(traits[i][1])) {
              $('#trait_'+traits[i][0].toLowerCase().substring(0,3)+' div.div-table-col:nth-child(7) .ui-icon:last-child').show()
            }
         }
     }
    }});
}
  $( function() {
       refreshdata(34);
  } );