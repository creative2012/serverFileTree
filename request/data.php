<?php

$parent = 'root';
$group = '';
$node = array();
function getFolderContent($dir)
{
    
    $children = array();
    // Open a directory, and read its contents
    if (is_dir($dir))
    {
        if ($dh = opendir($dir))
        {
            $id = uniqid();
            $node1 = array(
                'id' => $id,
                'parent' => $GLOBALS['parent'],
                'group' => $GLOBALS['group'],
                'node' => basename($dir.'/'),
                'path' => $dir,
            );


            while (($file = readdir($dh)) !== false)
            {

                if($file != '.' && $file != '..') 
                {
                    //Get file info
                    $path_parts = pathinfo($dir.'/'.$file);
                    $type = filetype($dir.'/'.$file);
                    if($GLOBALS['group'] === ''){
                        $GLOBALS['group'] = $file;
                    } 
                    if($type == 'dir')
                    {
                        //recursivly open nested directory
                        $GLOBALS['parent'] = $id;
                        getFolderContent($dir.'/'.$file);
                        $GLOBALS['group'] = '';
                    }
                      
                }
            }

                //add all nodes
                array_push($GLOBALS['node'], $node1);

            closedir($dh);
        }
    }
}
function getFiles($dir)
{
    $files = array();
    if (is_dir($dir))
    {
        if ($dh = opendir($dir))
        {


            while (($file = readdir($dh)) !== false)
            {

                if($file != '.' && $file != '..') 
                {
                    //Get file info
                    $path_parts = pathinfo($dir.'/'.$file);
                    $type = filetype($dir.'/'.$file);
                    $fileName  = $path_parts['filename'];
                    
                    // check is not dir
                    if($type != 'dir')
                    {

                        //create children array
                        $extension = $path_parts['extension'];
                        $list3 = array(
                            'name' => $fileName, 
                            'ext' => $extension,
                            'size' => filesize($dir.'/'.$file),
                            'link' => substr($dir, 3).'/'.$file
                        );
                            array_push($files, $list3);
                    } 
                   
                      
                }

                
            }

            closedir($dh);
        }
    }
    
    return $files;

}

if(isset($_GET['folders'] ) ){

getFolderContent($_GET['path']);
echo json_encode($node);

} else if (isset($_GET['files'] )){

$files = getFiles($_GET['path']); 
echo json_encode($files);
}

?>