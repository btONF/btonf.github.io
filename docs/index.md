---
hide: navigation,footer,toc
title: 🏠首页
---

 <!-- 英雄部分 -->
<div class="hero">
	<h1>Welcome to Bt's Docs >_</h1>
	<center><font class="anim-span"  color= #ffffff size=6 class="ml3" style="opacity:0.6">“不为草木，随遇而安”</font></center>
</div>

<div class="grid cards" markdown>

-   :simple-android:{ .lg .middle } __Android 常用命令__

    ---

	开发命令备忘

    [[常用命令|:octicons-arrow-right-24: 查看]]

-   :fontawesome-solid-gear:{ .lg .middle } __Material 配置__

    ---

    - [:material-emoticon-devil:  表情](https://squidfunk.github.io/mkdocs-material/reference/icons-emojis/)

    [:octicons-arrow-right-24: 更多配置](https://squidfunk.github.io/mkdocs-material/setup/)

-   :material-chart-bar:{ .lg .middle } __Mermaid__

    ---

    - [泳道图](https://mermaid.js.org/syntax/sequenceDiagram.html)
    - [流程图](https://mermaid.js.org/syntax/flowchart.html)

    [:octicons-arrow-right-24: 更多图表](https://mermaid.js.org/intro/)

-   :material-library:{ .lg .middle } __资源收集__

    ---

	- [[图标库|svg 图标]]

</div>
<style>
	
	/* 英雄部分样式 */
	.hero {
		background: linear-gradient(135deg, #6200ee, #03dac5);
		text-align: center;
		padding: 80px 40px;
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
		try {
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
		 } catch (error) { 
			 console.log(error); // 或其他的错误处理
		 }
	}
	splitTextAndAnimate(); 
	// 监听窗口大小变化，重新触发动画
	window.addEventListener('load', function() {
		splitTextAndAnimate(); // 页面resize后重新拆分并动画
	});

	// 监听窗口大小变化，重新触发动画
	window.addEventListener('resize', function() {
		splitTextAndAnimate(); // 页面resize后重新拆分并动画
	});
</script>

