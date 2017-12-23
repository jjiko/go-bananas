<?php namespace Jiko\Banana\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Routing\Router;

class RouteServiceProvider extends ServiceProvider
{
  protected $namespace = 'Jiko\Banana\Http\Controllers';

  public function map(Router $router)
  {
    require_once(__DIR__ . '/../helpers.php');

    $router->group(['namespace' => $this->namespace], function () {
      require_once(__DIR__ . '/../Http/routes.php');
    });
  }
}