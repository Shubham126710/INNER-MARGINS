const { savePost } = require('./src/actions/post.actions.js');

async function test() {
  const formData = {
      id: '0def3849-286f-4850-9711-d3a7062a2004',
      title: 'HUMDRUM',
      excerpt: 'Today was awful for all the bad reasons, our class was finally called to attend the fancy AI event but instead of letting us go anywhere, they forced ...',
      content: 'Today was awful for all the bad reasons, our class was finally called to attend the fancy AI event but instead of letting us go anywhere, they forced us to attend an awful seminar, a seminar where the anchors were eating our brains out for 3-4 hrs because the panelists were "late". I will be honest, I hate when the anchors think they are doing us a favour by playing trivial games or asking the audience to say something, but I feel it is a total waste of time. Today was unproductive too, the one class we did have, the faculty was absent, I felt lost today amidst this nonsense, we had 2 hrs break and I felt empty again, loneliness does burn you from inside sometimes especially during big events like this when you see all those couples cherishing together.<div>Hoping the next week brings some rays of positivity.&nbsp;</div>',
      coverImage: '',
      category: '',
      tags: [],
      isLocked: true,
      isFeatured: false,
      isPublished: true
  };
  try {
      await savePost(formData);
      console.log("Success!");
  } catch(e) {
      console.error(e);
  }
}
test();
