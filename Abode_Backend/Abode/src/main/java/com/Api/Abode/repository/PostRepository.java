package com.Api.Abode.repository;

import com.Api.Abode.model.Post;
import com.Api.Abode.model.Room;
import com.Api.Abode.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByRoom(Room room);
    List<Post> findByUser(User user);

    @Query("SELECT p FROM Post p JOIN FETCH p.user JOIN FETCH p.room")
    List<Post> findAllWithUserAndRoom();

    //List<Post> findByUser_UsernameContainingIgnoreCase(String username);

}
