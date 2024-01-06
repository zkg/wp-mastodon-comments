<?php

/*
    Plugin Name: Mastodon Comments
    Description: Allows users to comment via Mastodon. Please make sure to install and configure ActivityPub first!
    Version: 0.1
    Author: Giacomo Miceli
    Based on Michael Thomas's blog
*/

function mastodon_comments() {
    // Register and enqueue the script
    wp_register_script( 'mastodon-comments', plugins_url('/mastodon-comments.js', __FILE__), array(), '1.0', true );
    wp_enqueue_script( 'mastodon-comments' );

    // Localize the script with new data
    $translation_array = array(
        'mastodon_url' => get_permalink()
    );
    
    wp_localize_script( 'mastodon-comments', 'mastodon_object', $translation_array );
}

add_action( 'wp_enqueue_scripts', 'mastodon_comments' );

function modify_comments_form($defaults) {
    $defaults['title_reply_before'] = '<h3 id="reply-title" class="comment-reply-title">Post a Comment through Mastodon </h3>
    <p>If you have a Mastodon account <button class="addComment">Reply through the Fediverse</button></p>';
    $defaults['title_reply_after'] = '<div id="ctnr"></div>';

    return $defaults;
}
add_filter('comment_form_defaults', 'modify_comments_form');

function mastodon_comment_form_defaults($defaults) {
    $defaults['title_reply'] = '<h3>'.esc_html__('Post a Comment through WordPress', 'text-domain')."</h3>";                    
    return $defaults;  
}  
add_filter('comment_form_defaults', 'mastodon_comment_form_defaults');
