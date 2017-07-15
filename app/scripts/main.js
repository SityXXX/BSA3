document.onreadystatechange = function () {
  if(document.readyState === 'complete') {

    let xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.onreadystatechange = () => {

      if(xmlHttpRequest.readyState === xmlHttpRequest.DONE) {
        if(xmlHttpRequest.status === 200) {

          let responsObject = JSON.parse(xmlHttpRequest.responseText);
          let posts = responsObject.data;
          const PostsObj = new Posts(posts);

          window.onscroll = () => {
            let documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight,
              document.documentElement.clientHeight, document.documentElement.scrollHeight,
              document.documentElement.offsetHeight);

            let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            let windowScroll = window.pageYOffset || document.documentElement.scrollTop;

            if((windowHeight + windowScroll) === documentHeight) {

              PostsObj.getPosts(Posts.start);

            }
          };

          document.getElementById('search').oninput = function() {
            PostsObj.searchPosts(this.value);
          };

        }
      }
    };

    xmlHttpRequest.open('GET','https://api.myjson.com/bins/152f9j');
    xmlHttpRequest.send();
  }
};

class Posts {

  constructor(posts) {

    this.posts = posts;
    this.filteredPosts = posts;
    this.renderPosts();

  }

  renderPosts(pos = 0, limit = 10) {

    this.sortPosts();

    let postsContainer = document.createElement('div');

    for(let i=0;i < limit; i++) {

      let date = new Date(this.filteredPosts[pos+i].createdAt);

      let post = document.createElement('div');
      post.className = 'col-md-3 post';

      let img = document.createElement('img');
      img.setAttribute('src',this.filteredPosts[pos+i].image);
      img.setAttribute('alt',this.filteredPosts[pos+i].title);
      img.className = 'post__img';

      let title = document.createElement('h1');
      title.className = 'post__title';
      title.textContent = this.filteredPosts[pos+i].title;

      let description = document.createElement('p');
      description.className = 'post__description';
      description.textContent = this.filteredPosts[pos+i].description;

      let createDate = document.createElement('time');
      createDate.className = 'post__date';
      createDate.setAttribute('datetime',this.filteredPosts[pos+i].createdAt);
      createDate.textContent = date.toLocaleString('uk-UA', Posts.dateOptions);

      let tags = document.createElement('div');
      tags.className = 'post__tags';

      this.filteredPosts[pos+i].tags.forEach((el) => {

        let tag = document.createElement('span');
        tag.className = 'post__tag';
        tag.textContent = el;
        tags.appendChild(tag);

      });

      post.appendChild(img);
      post.appendChild(title);
      post.appendChild(description);
      post.appendChild(createDate);
      post.appendChild(tags);

      postsContainer.appendChild(post)


    }

    document.getElementById('posts').innerHTML = postsContainer.innerHTML;

    Posts.start += limit;

  }

  searchPosts(searchPhrase) {
    if(searchPhrase.length > 0) {
      let resultArray = [];
      this.posts.forEach((el) => {
        if (el.title.toLowerCase().includes(searchPhrase)) {
          resultArray.push(el);
          console.log(resultArray.length);
        }
      });
      this.filteredPosts = resultArray;
      this.renderPosts();
    } else {
      this.filteredPosts = this.posts;
    }
  }


  sortPosts() {
    this.filteredPosts.sort((a,b) => {
      if(new Date(a.createdAt) < new Date(b.createdAt)) {
        return 1;
      } else if(new Date(a.createdAt) > new Date(b.createdAt)) {
        return -1;
      } else {
        return 0;
      }
    });
  }


}

Posts.dateOptions = {
  year: 'numeric',
  month:'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};
