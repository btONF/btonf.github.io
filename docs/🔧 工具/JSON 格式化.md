
<div class="bt-jsonformat-container">
	<textarea id="jsonInput" class="bt-jsonformat-textarea" placeholder="在此粘贴 JSON 字符串"></textarea>
	<button class="bt-jsonformat-button" onclick="formatJson()">格式化</button>
	<div id="output" class="bt-jsonformat-output"></div>
	<button class="bt-jsonformat-copy-button" onclick="copyToClipboard()">复制</button>
</div>
<script>
	function formatJson() {
		const jsonInput = document.getElementById('jsonInput').value;
		const outputDiv = document.getElementById('output');
		outputDiv.innerHTML = '';

		try {
			const parsedJson = JSON.parse(jsonInput);
			const formattedJson = syntaxHighlight(JSON.stringify(parsedJson, null, 2));
			outputDiv.innerHTML = `<pre>${formattedJson}</pre>`;
		} catch (error) {
			outputDiv.innerHTML = `<span class="bt-jsonformat-error">JSON 格式错误：${error.message}</span>`;
		}
	}

	function syntaxHighlight(json) {
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			let cls = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'bt-jsonformat-key'; // 添加前缀
				} else {
					cls = 'bt-jsonformat-string'; // 添加前缀
				}
			} else if (/true|false/.test(match)) {
				cls = 'bt-jsonformat-boolean'; // 添加前缀
			} else if (/null/.test(match)) {
				cls = 'bt-jsonformat-null'; // 添加前缀
			}
			return '<span class="' + cls + '">' + match + '</span>';
		});
	}
	
	function copyToClipboard() {
		const outputText = document.getElementById('output').innerText;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(outputText).then(() => {
				alert('已复制到剪贴板！'); // 可选：显示提示信息
			}).catch(err => {
				console.error('复制失败：', err);
			});
		} else {
			// 兼容旧浏览器
			const tempTextArea = document.createElement('textarea');
			tempTextArea.value = outputText;
			document.body.appendChild(tempTextArea);
			tempTextArea.select();
			document.execCommand('copy');
			document.body.removeChild(tempTextArea);
		}
	}
</script>
<style>
	.bt-jsonformat-container { /* 前缀 */
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(120, 120, 120, 0.4);
	}
	.bt-jsonformat-textarea { /* 前缀 */
		width: 100%;
		height: 350px;
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
		resize: vertical;
	}
	.bt-jsonformat-button { /* 前缀 */
		padding: 10px 20px;
		background-color: #4CAF50;
		color: white;
		border: none;
		border-radius: 4px;
		margin-bottom: 10px;
		cursor: pointer;
	}
	.bt-jsonformat-button:hover { /* 前缀 */
		background-color: #45a049;
	}
	.bt-jsonformat-output { /* 前缀 */
		white-space: pre-wrap;
		font-family: monospace;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		overflow-x: auto;
		font-size: medium;
	}
	.bt-jsonformat-error { /* 前缀 */
		color: red;
	}
	/* JSON 格式化样式 - 使用前缀和更精细的层级颜色 */
	.bt-jsonformat-copy-button { /* 复制按钮样式 */
		padding: 10px 20px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 5px;
	}
	.bt-jsonformat-copy-button:hover {
		background-color: #0056b3;
	}
	/* JSON 格式化样式 - 扩展到 10 级 */
	.bt-jsonformat-json-level-0 { color: #333; }
	.bt-jsonformat-json-level-1 { color: #007bff; }
	.bt-jsonformat-json-level-2 { color: #dc3545; }
	.bt-jsonformat-json-level-3 { color: #28a745; }
	.bt-jsonformat-json-level-4 { color: #ffc107; }
	.bt-jsonformat-json-level-5 { color: #17a2b8; }
	.bt-jsonformat-json-level-6 { color: #fd7e14; } /* 新增 */
	.bt-jsonformat-json-level-7 { color: #9761fb; } /* 新增 */
	.bt-jsonformat-json-level-8 { color: #e83e8c; } /* 新增 */
	.bt-jsonformat-json-level-9 { color: #20c997; } /* 新增 */
	.bt-jsonformat-string { color: #007bff; }
	.bt-jsonformat-number { color: #dc3545; }
	.bt-jsonformat-boolean { color: #28a745; }
	.bt-jsonformat-null { color: #6c757d; }
	.bt-jsonformat-key { color: #5e5ef3; } /* 深蓝色 */
	
	
</style>