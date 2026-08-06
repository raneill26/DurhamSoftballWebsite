/* ==========================================================================
   Durham Softball - waiver text

   >>> READ THIS BEFORE GOING LIVE <<<
   This is a DRAFT structure, not legal advice and not a reviewed document.
   It was assembled from the league's own published Rules page plus the
   sections a release of this kind normally contains. It has NOT been reviewed
   by an attorney.

   Before collecting a single real signature, have a North Carolina attorney
   review it. Points worth raising with them:
     * NC law on enforceability of pre-injury liability releases
     * Whether Play NC's insurance carrier requires specific wording
     * Anyone under 18 needs a parent or guardian to sign; this form assumes
       every player is 18+ and blocks under-18 signing
     * How long signed waivers must be retained, and who may access them
   When the wording changes, bump WAIVER_VERSION in assets/js/config.js so
   old and new signatures stay distinguishable in the database.
   ========================================================================== */
(function (global) {
  'use strict';

  var SECTIONS = [
    ['Assumption of risk',
     'I understand that Durham Softball is a co-ed, recreational, adult, slow-pitch softball league ' +
     'operated by Play NC. I understand that, as in any sport, there is potential for significant ' +
     'injury. I further understand that some participants may have little or no experience playing ' +
     'softball, which can make injury more likely. I knowingly and voluntarily assume all risks ' +
     'associated with participating, including risks arising from the conduct of other participants, ' +
     'field and weather conditions, and travel to and from the field.'],

    ['My responsibility for safe play',
     'I accept that all players are responsible for playing the game as safely as possible. I agree to ' +
     'learn and use proper techniques of batting, fielding, and base running, and to temper my ' +
     'competitive spirit with good sportsmanship at all times.'],

    ['Fitness to participate',
     'I confirm that I am physically able to participate in this activity, and that I am not aware of ' +
     'any medical condition that would make participation unsafe for me or for others. I understand ' +
     'that the league does not provide medical personnel at games.'],

    ['Release',
     'In consideration of being permitted to participate, I release and agree not to sue Play NC, ' +
     'Durham Softball, their officers, directors, volunteers, umpires, sponsors, and the owners and ' +
     'operators of any facility used by the league, for any claim arising out of my participation, ' +
     'to the fullest extent permitted by North Carolina law. This release does not apply to conduct ' +
     'that is grossly negligent, willful, or wanton.'],

    ['Medical treatment',
     'I authorize the league to arrange emergency medical treatment on my behalf if I am injured and ' +
     'unable to consent, and I accept financial responsibility for the cost of that treatment.'],

    ['Code of conduct',
     'I have read the league Rules and agree to follow them, including the Code of Conduct. I ' +
     'understand that abusive language, fighting, or other conduct the league considers unacceptable ' +
     'can result in my suspension or removal without refund.'],

    ['Photography',
     'I understand that photographs and video are taken at league events and may be used by Play NC ' +
     'to promote the league and its charitable work. If I would prefer not to appear in them, I can ' +
     'email playncinc@gmail.com and the league will honour that request.'],

    ['My information',
     'I understand the league stores my name, email address, any phone number I provide, the exact ' +
     'text of this waiver, and the date I signed it. This is used to run the league and is not sold ' +
     'or shared with third parties.'],

    ['Electronic signature',
     'I understand that typing my name constitutes my electronic signature, and that I intend it to ' +
     'have the same legal effect as a handwritten signature. I confirm I am 18 years of age or older ' +
     'and am signing on my own behalf.']
  ];

  var text = SECTIONS.map(function (s) { return s[0] + '\n' + s[1]; }).join('\n\n');
  var html = SECTIONS.map(function (s) {
    return '<h3>' + s[0] + '</h3><p>' + s[1] + '</p>';
  }).join('');

  global.DS_WAIVER = {
    version: (global.DS_CONFIG && global.DS_CONFIG.WAIVER_VERSION) || 'draft',
    sections: SECTIONS,
    text: text,   // hashed on submit so the exact wording agreed to is provable
    html: html
  };
})(window);
