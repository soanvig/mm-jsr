<header class="page-header">
  <h1 class="page-header_inner">
      <a href="/">
          <span class="page-header_name page-header_name--red">M</span>
          <span class="page-header_name_ampersand">&</span>
          <span class="page-header_name page-header_name--black">M</span>
          <span class="page-header_subname">JS Range</span>
      </a>
  </h1>
</header>

<style>
.page-header {
	width: 250px;
	background: url("../images/name-background.png") center top no-repeat;
	background-size: contain;
	position: absolute;
	top: 0;
	left: 0
}

.page-header::before {
	content: "";
	display: block;
	padding-top: 100%
}

.page-header_inner {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	padding-top: 15%;
	padding-left: 15%;
	font-size: 0
}

.page-header_inner a {
	text-decoration: none;
	display: block;
	outline: 0
}

.page-header_name,
.page-header_name_ampersand {
	font-family: 'Elementary Gothic';
	font-size: 30px;
	line-height: 1;
	transition: all 300ms ease-in-out
}

.page-header_name_ampersand {
	font-size: 20px;
	color: #000
}

.page-header_name--red,
.page-header_inner a:focus .page-header_name--black,
.page-header_inner a:hover .page-header_name--black {
	color: #f00;
	text-shadow: 0 0 5px #000, 0 0 5px #000
}

.page-header_name--black,
.page-header_inner a:focus .page-header_name--red,
.page-header_inner a:hover .page-header_name--red {
	text-shadow: 0 0 3px #d00, 0 0 3px #d00, 0 0 3px #d00;
	color: #000
}

.page-header_subname {
	display: block;
	font-size: 28px;
	font-family: 'PT Sans';
	font-weight: bold;
	color: #fff;
	line-height: 1.5
}

@media all and (max-width: 850px) {
	.page-header {
		background: none;
		position: static;
		text-align: center;
		margin-bottom: 5vh
	}
	.page-header::before {
		display: none
	}
	.page-header_inner {
		position: static;
		padding: 0
	}
}
</style>