<?php namespace Jiko\Banana\Providers;

use Illuminate\Support\ServiceProvider;

class BananaServiceProvider extends ServiceProvider
{

  public function boot()
  {
    view()->addNamespace('banana', __DIR__ . '/../resources/views');

    $this->publishes([
      __DIR__ . '/../../public/dist/img' => public_path('vendor/bananas')
    ], 'images');
  }

  public function register()
  {

    $this->app->register('Jiko\Banana\Providers\RouteServiceProvider');

  }

}