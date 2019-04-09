/*
const tour_info = [
  {
    id: 'header_id',
    info: ['This is the header.', 'A header comes at the top of a page. Usually it contains heading elements such as h1. It can contain other elements that are appropriate at the top of a page though.'],
  },
  {
    id: 'home_id',
    info: ['This takes you to the Home page.'],
  },
  {
    id: 'profile_id',
    info: ['This shows you the profile of the current user. The current user may edit the page if she wishes.'],
  },
  {
    id: 'search_id',
    info: ['Search of content on this site using this input box.'],
  },
  {
    id: 'logout_id',
    info: ['This button logs you out.'],
  },
  {
    id: 'main_id',
    info: ['This holds the main content of the page.'],
  },
  {
    id: 'footer_id',
    info: ['This is the footer.'],
  },
];
*/


// An array of objects of the form
// {id, info} where id is the id of the element
// that is part of the tour, and
// info is an array of paragraphs that make up the
// text shown
let tour_info;
let toi_btn; // The button that starts the TOI
let toi_div; // The div that shows the TOI
let toi_info_div;// The child of the toi_div that has the text content
let toi_prev_btn, toi_next_btn, toi_cancel_btn;
let cur_index = 0;//Index of the item in the tour_info array

function createToiDiv() {
  toi_div = document.createElement('div');
  toi_div.id = 'toi_div';
  toi_info_div = document.createElement('div');
  //toi_info_div.id = 'toi_info_div';
  toi_div.appendChild(toi_info_div);
  const toi_btns_div = document.createElement('div');
  toi_btns_div.id = 'toi_btns_div';
  toi_prev_btn = document.createElement('button');
  toi_prev_btn.innerHTML = 'Previous';
  toi_next_btn = document.createElement('button');
  toi_next_btn.innerHTML = 'Next';
  toi_cancel_btn = document.createElement('button');
  toi_cancel_btn.innerHTML = 'Cancel';
  toi_btns_div.appendChild(toi_prev_btn);
  toi_btns_div.appendChild(toi_next_btn);
  toi_btns_div.appendChild(toi_cancel_btn);
  toi_div.appendChild(toi_btns_div);
  document.body.appendChild(toi_div);
}

/*
Call this function to set up the TOI.
Pass in the tour_info array(data) and
the id(toi_btn_id) of the button that starts the TOI.
*/
export default function toi_init(data, toi_btn_id) {
  createToiDiv();
  tour_info = data;

  toi_btn = document.getElementById(toi_btn_id);

  toi_btn.addEventListener('click', () => {
    if (tour_info.length === 0) {
      return;
    }
    // Obtain and store in tour_info the styles
    // we are going to override
    tour_info.forEach(item => {
      const el = document.getElementById(item.id);
      const computed_style = getComputedStyle(el);
      item.outlineWidth = computed_style.outlineWidth;
      item.outlineStyle = computed_style.outlineStyle;
      item.outlineColor = computed_style.outlineColor;
      item.opacity = computed_style.opacity;
      item.zIndex = computed_style.zIndex;
    });
    cur_index = 0;
    toi_prev_btn.disabled = true;
    toi_next_btn.disabled = (tour_info.length === 1) ? true : false;
    dimOtherIds(0);
    toi_div.style.display = 'block';
    toi_btn.disabled = true;// only one toi at a time
    showInfoForId(0);
  });

  toi_next_btn.addEventListener('click', () => {
    if ( cur_index >= tour_info.length - 1) {
      return;
    }
    if ( cur_index === tour_info.length - 2) {
      toi_next_btn.disabled = true;
    }
    if ( cur_index === 0 ) {
      toi_prev_btn.disabled = false;
    }
    resetStyles(cur_index);
    cur_index++;
    dimOtherIds(cur_index);
    showInfoForId(cur_index);
  });

  toi_prev_btn.addEventListener('click', () => {
    if ( cur_index <= 0) {
      return;
    }
    if ( cur_index === 1) {
      toi_prev_btn.disabled = true;
    }
    if ( cur_index === tour_info.length - 1) {
      toi_next_btn.disabled = false;
    }
    resetStyles(cur_index);
    cur_index--;
    dimOtherIds(cur_index);
    showInfoForId(cur_index);
  });

  toi_cancel_btn.addEventListener('click', () => {
    for (let i = 0; i < tour_info.length; i++) {
      resetStyles(i);
    }
    toi_div.style.display = 'none';
    toi_btn.disabled = false;
  });
}

function showInfoForId(id_index) {
  const item = tour_info[id_index];
  const {id, info} = item;
  const info_paras = info.map( el => `<p>${el}</p>`);
  toi_info_div.innerHTML = '';
  toi_info_div.innerHTML = info_paras.join('');
  const toi_height = toi_div.getBoundingClientRect().height;
  const y_offset = 10;
  const win_h = document.documentElement.clientHeight;

  const element = document.getElementById(id);

  element.style.opacity = item.opacity;
  element.style.outline = '5px solid tomato';
  element.style.zIndex = '100';

  let bounds = element.getBoundingClientRect();
  let bound_top = bounds.top;
  // bring element into view and get bounds again
  if (bound_top < 0 || bound_top > win_h) {
    element.scrollIntoView();
    bounds = element.getBoundingClientRect();
    bound_top = bounds.top;
  }
  let y_pos;
  /*
  If the top of the element is above the vertical middle of the
  visible area, we show the toi div below the element, otherwise,
  we show it above the element
  */
  if (bound_top < win_h/2) {
    y_pos = bounds.bottom + y_offset;
  } else {
    y_pos = bound_top - toi_height - y_offset;
  }

  y_pos += pageYOffset;// take care of scroll offset
  toi_div.style.left = bounds.left + pageXOffset + 'px';
  toi_div.style.top = y_pos + 'px';
  const toi_top = toi_div.getBoundingClientRect().top;
  if (toi_top > win_h) {
    toi_div.scrollIntoView();
  }
}

function resetStyles(id_index) {
  const item = tour_info[id_index];
  const {id} = item;
  const el = document.getElementById(id);
  el.style.outlineWidth = item.outlineWidth;
  el.style.outlineStyle = item.outlineStyle;
  el.style.outlineColor = item.outlineColor;
  el.style.opacity = item.opacity;
  el.style.zIndex = item.zIndex;
}

function dimOtherIds(id_index) {
  const {id:cur_id} = tour_info[id_index];
  const all_other_ids = tour_info.filter(({id}) => id !== cur_id ).map(({id}) => id);
  all_other_ids.forEach(id => {
    const el = document.getElementById(id);
    el.style.opacity = '0.4';
  });
}