let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

class PageElement {
  constructor(id, x, y, create, update) {
    this.id = id;
    this.x = x;
    this.y = y;

    this.create = create;
    this.update = update;
  }
}

let titlePage = {
  id: 'js-title-svg',
  x: 1,
  initialize: () => {},
  update: () => {}
};

let introductionPage = {
  id: 'js-introduction-svg',
  x: 0.5,
  svg: null,
  dataPoints: 20,
  rectangles: [],
  initialize: function() {
    // Clear any pre-existing svgs.
    d3.select('.js-introduction-svg').selectAll("*").remove();

    this.svg = d3.select('.js-introduction-svg').append('svg').attr('height', '100%').attr('width', '100%');

    for(let i = 0; i < this.dataPoints; i++) {
      let colorTopBound = (c) => {return c > 255 ? 255 : c};
      let colorBottomBound = (c) => {return c < 0 ? 0 : c};
      let colorBound = (c) => {return Math.floor(colorTopBound(colorBottomBound(c)))};

      let r = 255 - colorBound(i * (1/this.dataPoints) * 255);
      let g = 0;
      let b = colorBound(i * (1/this.dataPoints) * 255);

      this.rectangles[i] = this.svg.append('rect')
                                    .attr('x', ((w/2)/this.dataPoints) * (i+1))
                                    .attr('y', this.y)
                                    .attr('width', ((w/2)/this.dataPoints))
                                    .attr('height', ((w/2)/this.dataPoints))
                                    .style('fill', `rgb(${r},${g},${b})`)
                                    .style('stroke', `black`)
                                    .style('stroke-width', `1`);
    }
  },
  update: function(scroll) {
    // introductionSVGCircle.attr('cy', scroll/2);

    for(let i = 0; i < this.rectangles.length; i++) {
      let percentageOfYScroll = (scroll - this.y) * (1/h);
      percentageOfYScroll = percentageOfYScroll < 0 ? 0 : percentageOfYScroll;

      this.rectangles[i].attr('y', scroll/2)
                        .attr('width', ((w/2)/this.dataPoints)*(percentageOfYScroll))
                        .attr('h', ((w/2)/this.dataPoints));
                          // .attr('x', ((w/2)/this.dataPoints) * (i+1) + (Math.sin(scroll * (Math.PI/360)) * 40));
    }
  }
};

let webpageElements = [titlePage, introductionPage];

function isLiveElement(element, scroll) {
  return element.y - h < scroll && element.y + h > scroll;
}

function handleScrollEvent() {
  let scroll = $(window).scrollTop();

  for (let i = 0; i < webpageElements.length; i++) {

    let webElement = webpageElements[i];

    if (isLiveElement(webElement, scroll)) {
      webElement.update(scroll);
    }
  }
}

function resetWebpageElements() {
  for (let i = 0; i < webpageElements.length; i++) {
    webpageElements[i].initialize();

    webpageElements[i].y = $('.' + webpageElements[i].id).offset() ? $('.' + webpageElements[i].id).offset().top : 0;
    console.log('y:', webpageElements[i].y);
  }
}

$(document).ready(() => {
  // Set up the handler to respond to any scrolling on the webpage.
  $(document).scroll(handleScrollEvent);
  // Set up initial scroll amount.
  handleScrollEvent();

  resetWebpageElements();

  $('.js-scroll-down-box').click(() => {
    $('html, body').animate({scrollTop: introduction.y * h}, 800);
  });
})

window.onresize = (event) => {
  w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  resetWebpageElements();
};
