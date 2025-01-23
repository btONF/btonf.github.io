---
hide: navigation,footer,toc
title: 首页
---

 <!-- 英雄部分 -->
<div class="hero">
	<h1>Welcome to Bt's Docs >_</h1>
	<center><font  color= #757575 size=6 class="ml3">“循此苦旅 以达星辰”</font></center>
<script src="https://cdn.statically.io/libs/animejs/2.0.2/anime.min.js"></script>
	<a href="page1.md">快速开始</a>
	<a href="page2.md">了解更多</a>
</div>

<!-- 功能块部分 -->
<div class="features">
	<div class="feature">
		<h3>功能 1</h3>
		<p>探索我们的第一个功能，帮助您快速完成任务。</p>
		<a href="page1.md">了解更多</a>
	</div>
	<div class="feature">
		<h3>功能 2</h3>
		<p>使用我们提供的工具提升您的工作效率。</p>
		<a href="page2.md">了解更多</a>
	</div>
	<div class="feature">
		<h3>功能 3</h3>
		<p>获取详细的文档说明，轻松掌握使用技巧。</p>
		<a href="page3.md">了解更多</a>
	</div>
	<div class="feature">
		<h3>功能 4</h3>
		<p>获取详细的文档说明，轻松掌握使用技巧。</p>
		<a href="page3.md">了解更多</a>
	</div>
</div>

<style>
	
	.md-grid {
	  max-width: 100%; 
	}
	/* 英雄部分样式 */
	.hero {
		background: linear-gradient(135deg, #6200ee, #03dac5);
		color: white;
		text-align: center;
		padding: 80px 20px;
	}

	.hero h1 {
		font-size: 2.5em;
		margin-bottom: 15px;
	}

	.hero p {
		font-size: 1.2em;
		margin-bottom: 25px;
	}

	.hero a {
		display: inline-block;
		margin: 10px;
		padding: 10px 20px;
		background: white;
		color: #6200ee;
		text-decoration: none;
		border-radius: 5px;
		font-weight: bold;
		transition: background 0.3s, color 0.3s;
	}

	.hero a:hover {
		background: #3700b3;
		color: white;
	}

	/* 功能块部分样式 */
	.features {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		padding: 40px 20px;
		background: white;
	}

	.feature {
		flex: 1 1 calc(33.33% - 40px);
		max-width: calc(33.33% - 40px);
		margin: 20px;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s, transform 0.3s;
		background: white;
	}

	.feature:hover {
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		transform: translateY(-5px);
	}

	.feature h3 {
		font-size: 1.5em;
		margin-bottom: 10px;
		color: #6200ee;
	}

	.feature p {
		font-size: 1em;
		color: #555;
	}

	.feature a {
		display: block;
		margin-top: 15px;
		padding: 10px 15px;
		color: white;
		background: #6200ee;
		text-decoration: none;
		border-radius: 5px;
		transition: background 0.3s;
	}

	.feature a:hover {
		background: #3700b3;
	}

	/* 移动端优化 */
	@media screen and (max-width: 768px) {
		.feature {
			flex: 1 1 calc(50% - 40px);
			max-width: calc(50% - 40px);
		}
	}

	@media screen and (max-width: 480px) {
		.feature {
			flex: 1 1 100%;
			max-width: 100%;
		}
	}
	.content__inner h1 {
		display: none;
	}
</style>