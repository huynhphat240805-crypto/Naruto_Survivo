/* ============================================================================
   MODULE: src/Enemy/EnemyHealth.js
   Quản lý Thanh Máu Quái Vật & Xử Lý Sự Kiện Quái Chết Rơi Hạt Kinh Nghiệm
   ============================================================================ */

window.EnemyHealth = {
    // Xử lý khi quái cạn sạch máu
    onDeath(enemy, game) {
        if (enemy.dead) return;
        enemy.dead = true;
        game.kills++;

        if (enemy.isBoss) {
            if (window.MusicController) window.MusicController.setBossPhase(false);
            game.addFloatingText(enemy.x, enemy.y - 40, "🏆 HẠ GỤC BOSS THÀNH CÔNG!", "#facc15", 22);
        }

        // Rơi hạt Chakra EXP & Kim Cương
        if (window.DropItems) {
            window.DropItems.dropOnEnemyDeath(enemy, game);
        }
    }
};

