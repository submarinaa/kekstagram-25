// Модуль, отвечающий за отрисовку окна с полноразмерным изображением
import {isEscapePressed} from './util.js';

const body = document.querySelector('body');
const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture img');
const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
const social = document.querySelector('.big-picture__social');
const socialCaption = social.querySelector('.social__caption');
const socialCommentCount = social.querySelector('.social__comment-count');
const commentsLoader = social.querySelector('.comments-loader');
const likesCount = social.querySelector('.likes-count');

let commentsBound;

const createComments = function (picture, socialComment, pictureFragment, socialComments) {
  let breakBtn = 0;

  picture.comments.forEach(({ avatar, name, message }) => {
    if (breakBtn === commentsBound) {
      return;
    }
    const commentItem = socialComment.cloneNode(true);
    commentItem.querySelector('.social__picture').src = avatar;
    commentItem.querySelector('.social__picture').alt = name;
    commentItem.querySelector('.social__text').textContent = message;
    pictureFragment.appendChild(commentItem);
    breakBtn++;
  });

  socialComments.replaceChildren(pictureFragment);
};

const renderBigPicture = function (picture) {
  const socialComment = social.querySelector('.social__comment');
  const socialComments = social.querySelector('.social__comments');
  const pictureFragment = document.createDocumentFragment();

  commentsLoader.classList.remove('hidden');

  commentsBound = 5;
  if (commentsBound >= picture.comments.length) {
    commentsBound = picture.comments.length;
    commentsLoader.classList.add('hidden');
  }

  body.classList.add('modal-open');
  bigPicture.classList.remove('hidden');
  socialCommentCount.classList.remove('hidden');
  bigPictureImage.src = picture.url;
  socialCaption.textContent = picture.description;
  likesCount.textContent = picture.likes;
  socialCommentCount.textContent = `${commentsBound} из ${picture.comments.length} комментариев`;
  socialComments.replaceChildren(pictureFragment);
  createComments(picture, socialComment, pictureFragment, socialComments);

  const clickListener = () => {
    commentsBound += 5;
    if (commentsBound >= picture.comments.length) {
      commentsBound = picture.comments.length;
      commentsLoader.classList.add('hidden');
    }
    socialCommentCount.textContent = `${commentsBound} из ${picture.comments.length} комментариев`;
    createComments(picture, socialComment, pictureFragment, socialComments);
  };

  commentsLoader.addEventListener('click', clickListener);
  bigPictureCloseButton.addEventListener('click', () => commentsLoader.removeEventListener('click', clickListener));
  document.addEventListener('keydown', () => commentsLoader.removeEventListener('click', clickListener));
};

const onCloseButtonModal = function () {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
};

bigPictureCloseButton.addEventListener('click', () => {
  onCloseButtonModal();

  bigPictureCloseButton.removeEventListener('click', onCloseButtonModal);
});

document.addEventListener('keydown', (evt) => {
  if (isEscapePressed(evt)) {
    onCloseButtonModal();

    document.removeEventListener('keydown', onCloseButtonModal);
  }
});

export {renderBigPicture, onCloseButtonModal, body};
