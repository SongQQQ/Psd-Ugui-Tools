# 配置说明

### testMode
开发时进行测试为了方便为ture否则投入使用时为false

### description 
起到注释作用，不需要解析，随意修改

### component
组件标记
可以手动添加，但是如果出了手动添加config.json之外什么都不做，那就只是一个标记，需要再Unity端处理
如果想要在PS处理阶段就能起到作用，就需要修改PS端的代码。

像修改anchor的功能，因为处理rectTransform的功能是在PS端，为了利用到现有的代码，最好是在PS端处理掉。\



### type

所有的组件和参数都是通过名字传递给Unity的。

经过我的思考和参考UXP的文档，鉴于一些客观原因，我决定做出如下设计：
component和parameter的特定排列组合

component type: 

- checkbox 对应的子paramter有 空 和 text 。主要功能是直接添加标记，让Unity能识别到并处理. 如果你只想打标几，就用这个就好了，如果打算增加更复杂的逻辑，就需要看下面的内容，尝试修改系统代码。
- radioGroup 对应的子paramter有radio。 可以理解为单选题


