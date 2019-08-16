import React from 'react';
import './App.css';

function App() {

  const createFile = (name , path , type , folderPath , folderTag , content) => {

    let isDynamicName = name.match(/\$\{.+\}/i)

    return {
      name,
      level:path.split("/").length - (type === "folder" ? 3 : 2),
      type ,
      prototypeFile:undefined,
      subfolder:undefined,
      isDynamicName:isDynamicName ? true : false,
      tagName:"",
      folderPath:folderPath,
      folderTag:folderTag,
      content
    }

  }

  const fileChange = (e) => {

    let files = e.target.files
    let totalFile = files.length

    let mappedFolder = {}
    let folder = []
    let allFile = []

    // declare function
    const fillSubFolderFile = (files) => {

      let corFile = files.map((f , i) => {
        
        // set subfolder if have
        if (f.level > 0){
  
          f.subfolder = mappedFolder[f.folderPath]
  
        }
  
        return f
  
      })

      console.log("new file" , corFile);
  
    }
    
    Array.from(files).map((f , index) => {

      // split path
      let pathSliced = f.webkitRelativePath.split("/")
      let folderPath = ""

      // extract path to get folder
      if (pathSliced.length > 2){
        folderPath = pathSliced.slice(1 , pathSliced.length - 1)

        let localName = folderPath[folderPath.length - 1]
        let superName = pathSliced.slice(1 , pathSliced.length - 2).join("/")
        folderPath = folderPath.join("/")

        if (!mappedFolder[folderPath]){

          // console.log(folderPath);
          folder.push(createFile(localName , f.webkitRelativePath , "folder" , folderPath , superName , ""))
          mappedFolder[folderPath] = true

        }
      }

      // read file
      let reader = new FileReader();

      reader.onload = (e) => {

        // create file object and save to array
        let myFile = createFile(f.name , f.webkitRelativePath , "file" , folderPath , "" , e.target.result)
        allFile.push(myFile)

        // add subfolder when end reading files
        if( index === totalFile - 1){
          fillSubFolderFile(allFile)
        }
        
      }
      reader.readAsText(f)

      return f
      
    })

    // fake upload and get id
    let corFolder = folder.map((fo , i) => {

      // set subfolder if have
      if (fo.folderTag){
        fo.subfolder = mappedFolder[fo.folderTag]
      }

      // set id as fake upload
      let foID = Math.random()
      fo["id"] = foID
      mappedFolder[fo.folderPath] = foID
      return fo

    })

    console.log("new folder" , corFolder);

  }

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" webkitdirectory="" onChange={fileChange} multiple />
      </header>
    </div>
  );
}

export default App;
