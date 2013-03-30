#!/usr/bin/env perl
use v5.16;
use JSON;

my @srcs = (
    'installproperty.js',
    # 'wrap.js',
    'object-clone.js',
    'codepoints.js',
    'polyfill.js',
);

my $target = 'es2pi.js';
my $mini   = 'es2pi.min.js';
my $version = decode_json(slurp('package.json'))->{version};
open my $wfh, '>', $target or die "$target: $!";
print {$wfh} <<"EOT";
/*
 * es2pi.js
 *
 *  VERSION: $version
 *
 *  (c) 2013 Dan Kogai
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license
 *
 *  This file is auto-generated from src/*.js
 *
 */
EOT

for my $src (@srcs) {
    my $path = "src/$src";
    my $content = slurp($path);
    $content =~ s{\A/\*.+?\*/}{}msx;
    $content =~ s{\A\s+}{}msx;
    $content =~ s{\s+\z}{\n}msx;
    say {$wfh} "// $path //";
    print {$wfh} $content;
}
run('mocha');
run('mocha', '--harmony');
run('uglifyjs', '-o', $mini, $target);

sub slurp {
    local $/;
    my $fn = shift;
    open my $fh, '<', $fn or die "$fn: $!";
    my $ret = <$fh>;
    close $fh;
    $ret;
}

sub run {
    my $cmd = join ' ', @_;
    say $cmd;
    system @_ and die "$cmd : $!";
}

__DATA__
