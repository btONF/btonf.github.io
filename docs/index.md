---
hide: navigation,footer,toc
title: 首页
---

 <!-- 英雄部分 -->
<div class="hero">
	<h1>Welcome to Bt's Docs >_</h1>
	<center><font class="anim-span"  color= #ffffff size=6 class="ml3" style="opacity:0.6">“循此苦旅 以达星辰”</font></center>
	<a href="#">快速开始</a>
	<a href="#">了解更多</a>
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
	
	/* 英雄部分样式 */
	.hero {
		background: linear-gradient(135deg, #6200ee, #03dac5);
		text-align: center;
		padding: 80px 20px;
		border-radius:30px;
	}

	.hero h1 {
		font-size: 2.5em;
		margin-bottom: 15px;
		color: white;
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
	}

	.feature {
		flex: 1 1 calc(50% - 40px);
		max-width: calc(50% - 40px);
		margin: 10px;
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
	.md-content {
		max-width: 50rem;
		margin:0 auto;
	}
</style>
<script>
	// 为每个带有 anim-span 类的元素添加文字拆分和动画
	function splitTextAndAnimate() {
		// 查找所有 class 为 anim-span 的元素
		document.querySelectorAll('.anim-span').forEach(textElement => {
			const textContent = textElement.textContent;

			// 清空内容并按字符拆分
			textElement.innerHTML = '';
			textContent.split('').forEach(char => {
				const span = document.createElement('span');
				span.classList.add('letter');
				span.textContent = char;
				textElement.appendChild(span);
			});

			// 使用 Anime.js 为拆分后的文字应用动画
			anime.timeline({loop: true})
				.add({
					targets: textElement.querySelectorAll('.letter'),
					opacity: [0, 1],
					translateY: [20, 0],
					easing: 'easeOutExpo',
					duration: 1000,
					delay: anime.stagger(100), // 每个字符的延迟
				})
				.add({
					targets: textElement.querySelectorAll('.letter'),
					opacity: [1, 0],
					translateY: [0, 20],
					easing: 'easeInExpo',
					duration: 1000,
					delay: anime.stagger(100),
				});
		});
	}

	// 监听窗口大小变化，重新触发动画
	window.addEventListener('load', function() {
		splitTextAndAnimate(); // 页面resize后重新拆分并动画
	});

	// 监听窗口大小变化，重新触发动画
	window.addEventListener('resize', function() {
		splitTextAndAnimate(); // 页面resize后重新拆分并动画
	});
</script>

