$(document).ready(function () {
    var $homePageTaxAlerts = '#home_panel #tax_alerts_home';
    var $newslettersPageAlerts = '#tax_alerts #tax_alerts_home';
    var $wideColumn8 = '<div class="col-sm-12 col-md-8 col-lg-8 contentMainInner"></div>';
    var $skinnyColumn4 = '<div class="col-sm-12 col-md-4 col-lg-4 insertTaxAlerts"></div>';
    var $moveTaxAlerts = $('<div id="repositionedTaxAlerts"></div>');
    
    if ($($homePageTaxAlerts).length > 0) {
        $('.content-main').wrapInner($wideColumn8);
        $('.content-main').append($skinnyColumn4);
        $('#home_panel').appendTo($moveTaxAlerts);
        $($moveTaxAlerts).appendTo('.insertTaxAlerts');
    }
    else if ($($homePageTaxAlerts).length === 0) {
        $('button#cchNewsletterSignUp').appendTo('.modules');
        $('div#divNewsletter1').insertBefore('.modules');
        $('#home_panel').remove();
    }
    if ($($newslettersPageAlerts).length > 0) {
        $('.content-main').wrapInner($wideColumn8);
        $('.content-main').append($skinnyColumn4);
        $('#tax_alerts').appendTo($moveTaxAlerts);
        $($moveTaxAlerts).appendTo('.insertTaxAlerts');
    }
});







