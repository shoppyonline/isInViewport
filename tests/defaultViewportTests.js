function runIsInViewport(tol) {
  $('#container > div.box').css('background-color', '#21221E').text('out of viewport');
  $('#container > div.box:in-viewport(' + tol + ')').css('background-color', '#C5C7BC').text('in viewport');
}

describe('isInViewport', function() {
  describe('viewport is window', function() {
    var div;
    var addContainer = function() {
      var html = '<div id="container"><div class="box">1</div></div>';
      $('body').prepend(html);
      runIsInViewport(100);
      div = $('.box');
    };
    var removeContainer = function() {
      $('#container').remove();
    };

    before(addContainer);

    after(removeContainer);

    function top(x, tol) {
      div.css('top', '0');
      div.css('top', x + 'px');
      runIsInViewport(tol);
    }

    function left(x, tol) {
      div.css('left', '0');
      div.css('left', x + 'px');
      runIsInViewport(tol);
    }

    describe('when tolerance is 100', function() {
      describe('div location vertically in viewport', function() {
        describe('when bottom of div is outside tolerance region while top is inside', function() {
          it('should return the text from div as "in viewport"', function() {
            div.text().should.be.exactly('in viewport');
          });
        });
        describe('when bottom of div is equal to tolerance ie it\'s on the edge of tolerance region', function() {
          it('should return the text from div as "in viewport"', function() {
            top(-100, 100);
            div.text().should.be.exactly('in viewport');
          });
        });
        describe('when bottom of div is inside tolerance region', function() {
          it('should return the text from div as "out of viewport"', function() {
            top(-150, 100);
            div.text().should.be.exactly('out of viewport');
          });
        });
        describe('when top of div is equal to tolerance ie it\'s on the edge of tolerance region', function() {
          it('should return the text from div as "in viewport"', function() {
            top(100, 100);
            div.text().should.be.exactly('in viewport');
          });
        });
        describe('when top of div is outside tolerance region', function() {
          it('should return the text from div as "out of viewport"', function() {
            top(101, 100);
            div.text().should.be.exactly('out of viewport');
          });
        });
      });

      describe('div location horizontally in viewport', function() {
        describe('when left is greater than viewport width', function() {
          it('should return the text from div as "out of viewport"', function() {
            top(0, 100);
            left(99999, 100);
            div.text().should.be.exactly('out of viewport');
          });
        });
        describe('when left is greater than viewport left edge', function() {
          it('should return the text from div as "out of viewport"', function() {
            left(-99999, 100);
            div.text().should.be.exactly('out of viewport');
          });
        });
        describe('when left is lesser than viewport width', function() {
          it('should return the text from div as "in viewport"', function() {
            left(90, 100);
            div.text().should.be.exactly('in viewport');
            left(0, 100);
          });
        });
      });
    });

    describe('when tolerance is 0', function() {
      describe('div location vertically in viewport', function() {
        describe('when div top is 0', function() {
          it('should return the text from div as "in viewport"', function() {
            top(0, 0);
            left(0, 0);
            div.text().should.be.exactly('in viewport');
          });
        });
        describe('when div top < 0 but bottom > 0', function() {
          it('should return the text from div as "in viewport"', function() {
            top(-1, 0);
            div.text().should.be.exactly('in viewport');
          });
        });
        describe('when div bottom < 0', function() {
          it('should return the text from div as "out of viewport"', function() {
            top(-201, 0);
            div.text().should.be.exactly('out of viewport');
          });
        });
        describe('when div top > viewport height', function() {
          it('should return the text from div as "out of viewport"', function() {
            top(99999, 0);
            div.text().should.be.exactly('out of viewport');
          });
        });
        describe('when both divs are in viewport', function() {
          describe('when an two arbitrary functions are chained using .do', function() {
            describe('when the first fn changes inner text to done and second adds a class name given by inner text', function() {
              it('should have added a class named "donedone" to both divs', function() {
                removeContainer();
                var html = '<div id="container"><div class="box">1</div><div class="box">2</div></div>';
                $('body').prepend(html);
                var divs = $('div.box:in-viewport');
                var count = 0;
                divs.should.have.length(2, 'length isn\'t 2');
                divs.do(function() {
                  this.text('done');
                }).do(function() {
                  //this.text() returns 'donedone' and not just 'done' as
                  //'this' is not a single div but a jquery collection 
                  //given by $('div.box:in-viewport')
                  this.addClass(this.text());
                });
                $.each(divs, function(i, v) {
                  if ($(v).hasClass('donedone'))
                    count++;
                });
                count.should.be.exactly(2, 'both divs don\'t have "done" class');
              });
            });
          });
        });
      });

      describe('div location horizontally in viewport', function() {
        describe('when left is greater than viewport width', function() {
          it('should return the text from div as "out of viewport"', function() {
            removeContainer();
            addContainer();
            top(0, 0);
            left(99999, 0);
            div.text().should.be.exactly('out of viewport');
          });
        });
        describe('when left is greater than viewport left edge', function() {
          it('should return the text from div as "out of viewport"', function() {
            left(-99999, 0);
            div.text().should.be.exactly('out of viewport');
          });
        });
        describe('when left is lesser than viewport width', function() {
          it('should return the text from div as "in viewport"', function() {
            left(90, 0);
            div.text().should.be.exactly('in viewport');
            left(0, 0);
          });
        });
      });
    });

    describe('when tolerance is -100', function() {
      it('should be window.height - abs(tolerance)', function() {
        var winHt = $(window).height();
        top(winHt - 100, -100);
        div.text().should.be.exactly('in viewport');
      });
    });
  });
});
