<?php namespace Jiko\Banana\Http\Controllers;

use DebugBar\DebugBar;
use Jiko\Http\Controllers\Controller as Controller;

class BananaPageController extends Controller
{
  public function index()
  {
    \Debugbar::disable();
    return view('banana::index');
  }
}