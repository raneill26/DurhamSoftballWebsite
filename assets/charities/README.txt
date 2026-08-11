Optional charity photos for the homepage spotlight and charity pages.

Drop a JPG named after the org id, e.g.:
  aps.jpg          Animal Protection Society of Durham
  bike.jpg         Bike Durham
  swing.jpg        SwingPals

Then add that id to CHARITY_PHOTOS in assets/js/data.js:
  var CHARITY_PHOTOS = ['aps','bike','swing'];

Ids not listed there fall back to the org's logo on a dark panel, which is
what every partner shows today. Landscape images around 800x400 work best.
