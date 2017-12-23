<?php namespace Jiko\Banana\Http\Controllers;

use DebugBar\DebugBar;
use Jiko\Http\Controllers\Controller as Controller;

class BananaPageController extends Controller
{
  public function index()
  {
    \Debugbar::disable();
    return view('banana::index', [
      'bgBody' => package_path('resources/assets/img/bg-banana-tile2r.png'),
      'bgBadBanana' => package_path('resources/assets/img/bad-banana.png')
    ]);
  }
}