$(document).ready(function() {
  /* variables */
  const image = $('#drawingIcons div');
  const table = $('#pixel_canvas');
  const picker = $('#colorPicker');
  const errors = $('#errors');
  const bin = $('#iconDelete');

  let color = picker.val();
  let width = $('#input_width').val();
  let height = $('#input_height').val();

  let mousePressed = false;

  /* drawing icons click event */
  image.on('click', function() {
    color = picker.val();

    /* add/remove class */
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected');
    } else {
      $(this).addClass('selected').siblings().removeClass('selected');
    }

    /* change cursor */
    if ($(this).prop('id')=='iconPencil') {
      $('html').css('cursor', 'url(images/cursor/cursor-pencil.png) 2 12, pointer');
      paint();
      mousePressed = false;
    } else {
      $('html').css('cursor', 'url(images/cursor/cursor-eraser.png) 2 12, pointer');
      erase();
      mousePressed = false;
    }
  });

  /* generate grid */
  function makeGrid(w, h) {
    table.children().remove();

    for (let i=0; i<height; i++) {
      table.append('<tr></tr>');
      for (let j=0; j<width; j++) {
        table.children().last().append('<td></td>');
      }
    }
  }

  /* generate default grid */
  makeGrid(width, height);

  /* paint/erase functions */
  function paint() {
    picker.change(function(){
      color = $(this).val();
    });

    $('table td').on('mousedown', function() {
      mousePressed = true;
      if(mousePressed) {
        $(this).css("background-color", color);
      }
    })
    .on('mouseup', function() {
      mousePressed = false;
    })
    .on('mouseover', function() {
      if(mousePressed) {
        $(this).css("background-color", color);
      }
    });
  }

  function erase() {
    $('table td').on('mousedown', function() {
      mousePressed = true;
      if(mousePressed) {
        $(this).removeAttr('style');
      }
    })
    .on('mouseup', function() {
      mousePressed = false;
    })
    .on('mouseover', function() {
      if(mousePressed) {
        $(this).removeAttr('style');
      }
    });
  }

  /* clean drawing */
  bin.on('click', function() {
    table.find('td').removeAttr('style');
  });


  /* validate custom grid inputs */
  function validateInputs() {
    width = $('#input_width').val();
    height = $('#input_height').val();

    if (width <= 0 || width > 40 || height <= 0 || height > 40) {
      errors.html('values:<br>0-40');
      return false;
    } else {
      errors.text('');
      return true;
    }
  }

  /* submit event (icon click) */
  $('#iconSubmit').click(function(event){
      event.preventDefault();
      validateInputs();
      if(validateInputs()) {
        if (image.hasClass('selected')) {
          image.removeClass('selected');
        }
        makeGrid($('#input_width').val(),$('#input_height').val());
        $('html').css('cursor', 'auto');

      }
  });

  /* submit event (keyboard enter */
  $('input[type=number]').on('keydown', function(event) {
    if (event.which == 13) {
        event.preventDefault();
        validateInputs();
        if(validateInputs()) {
          if (image.hasClass('selected')) {
            image.removeClass('selected');
          }
          makeGrid($('#input_width').val(),$('#input_height').val());
          $('html').css('cursor', 'auto');

        }
    }
  });

  /* save image as .png */
  $("#iconSave").click(function() {
        html2canvas($("#pixel_canvas"), {
            onrendered: function(canvas) {
              Canvas2Image.saveAsPNG(canvas);
              $("body").remove(canvas);
            }
        });
    });
});
