'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML)
}

const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: ' .list.tags',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorListSelector: '.list.authors'
};

function titleClickHandler(event){

  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);
  console.log('clickedElement (with plus): ' + clickedElement);
  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = '') {
  console.log('Title was clicked!');

  /* [DONE] remove all article links  */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  console.log('customSelector' + customSelector);

  /* get all "id" attribute from articles */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  console.log(articles);

  let html = '';

  /*  get id, title for single article */
  for(let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    console.log(articleTitle);
    console.log(articleId);

    /* create link HTML */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

    /* titleList.insertAdjacentHTML("beforeend", linkHTML); */
    html = html + linkHTML;
    console.log(html);
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {max: 0, min: 999999};

  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor( percentage * (opts.cloudClassCount - 1) + 1);

  return classNumber;

}

function generateTags(){
  console.log('Generate Tag')

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  console.log(articles);

  /* START LOOP: for every article: */
  for(let article of articles) {

    /* find tags wrapper */
    const tagList = article.querySelector(opts.articleTagsSelector);
    tagList.innerHTML = '';

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray) {
      console.log(tag);

      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const href = 'tag-' + tag;
      const linkHTMLData = {id: href, title: tag};
      const linkHTML = templates.articleLink(linkHTMLData);

      console.log(linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML;
      console.log(html);

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
         allTags[tag]++;
      }

      console.log(allTags);

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
    console.log(tagList);

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);

  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  //let allTagsHTML = '';
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){

    const tagLinkHTML = '<li><a class="' + opts.cloudClassPrefix  + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li> ';
    console.log('taglinkHTML:', tagLinkHTML);



    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      id: 'tag-' + tag,
      count: allTags[tag],
      className: opts.cloudClassPrefix + calculateTagClass(allTags[tag], tagsParams)
    });

  /* [NEW] END LOOP: for each tag in allTags: */
  }

  /* [NEW] add html from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Tag was clicked!');

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log(tag);

  /* find all tag links with class active */
  const activeTag = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(activeTag);

  /* START LOOP: for each active tag link */
  for(let tag of activeTag) {

    /* remove class active */
    tag.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for(let link of tagLinks) {

    /* add class active */
    link.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const linksTag = document.querySelectorAll('.post-tags a');
  const listTag = document.querySelectorAll('.list.tags a');

  /* START LOOP: for each link */
  for(let element of listTag) {

    /* add tagClickHandler as event listener for that link */
    element.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }

  /* START LOOP: for each link */
  for(let link of linksTag) {

    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function gnerateAuthors () {
  console.log('Generate Authors')

  /* [NEW] create a new variable allAutors with an empty object */
  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);
  console.log(articles);

  /* START LOOP: for every article: */
  for(let article of articles) {
    console.log(article);

    /* find tags wrapper */
    const authorHTML = article.querySelector(opts.articleAuthorSelector);

    /* get author from data-author attribute */
    const author = article.getAttribute('data-author');
    const authorHref = author.replace(' ', '-');
    console.log(author);

    /* generate HTML of the author*/
    //const html = '<a href="#' + authorHref + '">by ' + author + '</a>';
    const linkHTMLData = {id: authorHref, title: author};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

    /* insert HTML into author wrapper */
    authorHTML.innerHTML = linkHTML;

    /* [NEW] check if this link is NOT already in allTags */
    if(!allAuthors.hasOwnProperty(author)) {
      /* [NEW] add author to allAuthors object */
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    console.log(allAuthors);
  /* END LOOP: for every article: */
  }

  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(opts.authorListSelector);

  /* [NEW] create variable for all links HTML code */
  const authorParams = calculateTagsParams(allAuthors);
  console.log('authorParams:', authorParams);
  let allAuthorsHTML = '';

  /* [NEW] START LOOP: for each author in allAuthors */
  for(let author in allAuthors) {
    const authorHref = author.replace(' ', '-');
    const autorLinkHTML = '<li><a href="#' + authorHref +  '" class="author-name">' + author + ' (' + allAuthors[author] + ')</a></li>';

    allAuthorsHTML += autorLinkHTML;
    console.log(allAuthorsHTML);
  }

  authorList.innerHTML = allAuthorsHTML;
  console.log(authorList);

}

gnerateAuthors ();

function authorClickLinks(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log('Author was clicked!');

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log(href);
  const author1 = href.replace('#', '');
  console.log(author1);
  const author = author1.replace('-', ' ');
  console.log(author);

  /* find all author links with class active */
  const activeAuthors = document.querySelectorAll('a.active');
  console.log(activeAuthors);

  /* START LOOP: for each active author link */
  for(let author of activeAuthors) {

    /* remove class active */
    author.classList.remove('active');

  /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(authorLinks);

  /* START LOOP: for each found author link */
  for(let link of authorLinks) {

    /* add class active */
    link.classList.add('active');

  /* END LOOP: for each found author link */
  }
  console.log (author);
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  /* find all links to authors */
  const linksAuthor = document.querySelectorAll('.post-author a');
  const listAuthor = document.querySelectorAll('.list.authors a');
  console.log('TEST: ', listAuthor);

  /* START LOOP: for each link */
  for(let link of linksAuthor) {

    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', authorClickLinks);

  /* END LOOP: for each link */
  }

  for(let element in listAuthor) {
    console.log('TEST: ', element);
    element.addEventListener('click', authorClickLinks);

  }
}

addClickListenersToAuthors();


