---
dg-publish: true
---


> python自带的库，不需要额外安装

  


## 代码

```python

  

import xml.etree.ElementTree as ET

import re

  

def main():

    # 打开xml文件

    tree = ET.parse("strings.xml")

    root = tree.getroot()

  

    # 遍历所有xml标签

    for child in root:

        # 如果标签字符长度小于20，将里面的每个单词的首字母大写

        if len(child.text) < 20:

            words = child.text.split(" ")

            for word in words:

                index = words.index(word)

                # 这里有点问题，最好根据拆分的数组size进行判断，正常4-5个单词以内的可以正常大写

                # 如果单词长度大于等于3，将首字母大写

                if len(word) >= 3 :

                    if not re.match(r"&|#|/|:|%|$|：", word):

                        word = word[0].upper() + word[1:]

                # 将修改后的单词重新拼接

                words[index] = word

            # 将修改后的文本赋值给标签

            child.text = " ".join(words)

  

    # 保存修改后的xml文件

    tree.write("output.xml")

  

if __name__ == "__main__":

    main()

```