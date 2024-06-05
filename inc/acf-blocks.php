<?php 
function my_acf_init() {
    // Check function exists.
    if( function_exists('acf_register_block_type') ) {

        // Register a test block.
        acf_register_block_type(array(
            'name'              => 'testblock',
            'title'             => __('Test block'),
            'description'       => __('A custom test block.'),
            'render_template'   => 'template-parts/blocks/test-block/test-block.php',
            'category'          => 'formatting',
            'icon'              => 'admin-comments',
            'keywords'          => array( 'test block', 'quote' ),
            'enqueue_style'     => get_template_directory_uri() . '/template-parts/blocks/test-block/test-block.css',
            'enqueue_script'    => get_template_directory_uri() . '/template-parts/blocks/test-block/test-block.js',
        ));

        // Register another block
        // acf_register_block_type(array(
        //     'name'              => 'another-block',
        //     'title'             => __('Another Block'),
        //     'description'       => __('Another custom block.'),
        //     'render_template'   => 'template-parts/blocks/another-block/another-block.php',
        //     'category'          => 'formatting',
        //     'icon'              => 'admin-customizer',
        //     'keywords'          => array( 'custom', 'block' ),
        //     'enqueue_style'     => get_template_directory_uri() . '/template-parts/blocks/another-block/another-block.css',
        //     'enqueue_script'    => get_template_directory_uri() . '/template-parts/blocks/another-block/another-block.js',
        // ));
    }
}
add_action('acf/init', 'my_acf_init');


?>